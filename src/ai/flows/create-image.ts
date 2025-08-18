'use server';
/**
 * @fileOverview Image generation flow.
 *
 * - createImage - A function that handles the image generation process.
 * - CreateImageInput - The input type for the createImage function.
 * - CreateImageOutput - The return type for the createImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateImageInputSchema = z.object({
  prompt: z
    .string()
    .min(10, {message: 'Please enter a more detailed description.'})
    .describe('A detailed description of the image to generate.'),
});
export type CreateImageInput = z.infer<typeof CreateImageInputSchema>;

const CreateImageOutputSchema = z.object({
  imageUrls: z.array(z.string()).describe("The generated images' data URIs."),
});
export type CreateImageOutput = z.infer<typeof CreateImageOutputSchema>;

export async function createImage(
  input: CreateImageInput
): Promise<CreateImageOutput> {
  return createImageFlow(input);
}

const generateSingleImage = async (prompt: string) => {
  const {media} = await ai.generate({
    model: 'googleai/gemini-2.0-flash-preview-image-generation',
    prompt: `A high resolution, 4k, photorealistic image of: ${prompt}`,
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  if (!media || !media.url) {
    throw new Error('Failed to generate image.');
  }

  return media.url;
};

const createImageFlow = ai.defineFlow(
  {
    name: 'createImageFlow',
    inputSchema: CreateImageInputSchema,
    outputSchema: CreateImageOutputSchema,
  },
  async input => {
    // Generate 4 images in parallel
    const imagePromises = Array(4)
      .fill(null)
      .map(() => generateSingleImage(input.prompt));
    
    const imageUrls = await Promise.all(imagePromises);

    return {imageUrls};
  }
);
