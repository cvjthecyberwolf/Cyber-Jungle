'use server';
/**
 * @fileOverview A video generation AI agent.
 *
 * - generateVideo - A function that handles the video generation process.
 * - GenerateVideoInput - The input type for the generateVideo function.
 * - GenerateVideoOutput - The return type for the generateVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {MediaPart} from 'genkit/model';

const GenerateVideoInputSchema = z.object({
  prompt: z.string().describe('The prompt to generate a video from.'),
  imageDataUri: z
    .string()
    .optional()
    .describe(
      "An optional image to use as a reference for the video, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type GenerateVideoInput = z.infer<typeof GenerateVideoInputSchema>;

const GenerateVideoOutputSchema = z.object({
  videoUrl: z.string().describe('The generated video data URI.'),
});
export type GenerateVideoOutput = z.infer<typeof GenerateVideoOutputSchema>;

export async function generateVideo(input: GenerateVideoInput): Promise<GenerateVideoOutput> {
  return generateVideoFlow(input);
}

const generateVideoFlow = ai.defineFlow(
  {
    name: 'generateVideoFlow',
    inputSchema: GenerateVideoInputSchema,
    outputSchema: GenerateVideoOutputSchema,
  },
  async input => {
    const prompt: (string | MediaPart)[] = [{text: input.prompt}];
    if (input.imageDataUri) {
       const match = input.imageDataUri.match(/^data:(image\/.+);base64,(.+)$/);
      if (match) {
        const [, contentType, body] = match;
        prompt.push({
          media: {
            url: `data:${contentType};base64,${body}`,
            contentType: contentType,
          },
        });
      } else {
        console.warn('Malformed imageDataUri received, proceeding without image.');
      }
    }

    let {operation} = await ai.generate({
      model: 'googleai/veo-3.0-generate-preview',
      prompt: prompt,
      config: {
        personGeneration: 'allow_all',
      }
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    // Wait until the operation completes.
    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      // Sleep for 5 seconds before checking again.
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    if (operation.error) {
      throw new Error('failed to generate video: ' + operation.error.message);
    }

    const video = operation.output?.message?.content.find(p => !!p.media);
    if (!video || !video.media?.url) {
      throw new Error('Failed to find the generated video');
    }

    // Veo returns a GCS URL that requires auth, so we fetch it and return as a data URI
    const fetch = (await import('node-fetch')).default;
    const videoDownloadResponse = await fetch(
      `${video.media.url}&key=${process.env.GEMINI_API_KEY}`
    );
    if (
      !videoDownloadResponse ||
      videoDownloadResponse.status !== 200 ||
      !videoDownloadResponse.body
    ) {
      throw new Error('Failed to fetch video');
    }
    const buffer = await videoDownloadResponse.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const contentType = video.media.contentType || 'video/mp4';

    const videoUrl = `data:${contentType};base64,${base64}`;

    return {videoUrl};
  }
);
