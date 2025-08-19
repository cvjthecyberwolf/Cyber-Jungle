'use server';
/**
 * @fileOverview A video generation AI agent using RunwayML API.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { MediaPart } from 'genkit/model';

const GenerateVideoInputSchema = z.object({
  prompt: z.string().describe('The prompt to generate the video.'),
  imageDataUri: z
    .string()
    .optional()
    .describe("An optional image (as Data URI) to use as a reference for the video."),
});
export type GenerateVideoInput = z.infer<typeof GenerateVideoInputSchema>;

const GenerateVideoOutputSchema = z.object({
  videoUrl: z.string().describe('The generated video download URL.'),
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
    // Build request payload
    const body: any = {
      prompt: input.prompt,
    };

    if (input.imageDataUri) {
      body.image = input.imageDataUri;
    }

    // Call RunwayML API
    const response = await fetch('https://api.runwayml.com/v1/video/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RUNWAYML_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`RunwayML API Error: ${error}`);
    }

    const result = await response.json();

    // Return video URL from RunwayML response
    return {
      videoUrl: result?.data?.[0]?.url || '',
    };
  }
);
