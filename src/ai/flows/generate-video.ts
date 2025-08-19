'use server';
/**
 * @fileOverview A video generation AI agent using RunwayML.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { MediaPart } from 'genkit/model';

// --------- Input Schema ----------
const GenerateVideoInputSchema = z.object({
  prompt: z.string().describe('The text prompt for generating the video'),
  imageDataUri: z
    .string()
    .optional()
    .describe('Optional reference image (Base64 or Data URI format)'),
});
export type GenerateVideoInput = z.infer<typeof GenerateVideoInputSchema>;

// --------- Output Schema ----------
const GenerateVideoOutputSchema = z.object({
  videoUrl: z.string().describe('The generated video download URL'),
});
export type GenerateVideoOutput = z.infer<typeof GenerateVideoOutputSchema>;

// --------- Flow Definition ----------
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
    try {
      // RunwayML API Endpoint
      const response = await fetch("https://api.runwayml.com/v1/video/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RUNWAYML_API_KEY}`, // your key in .env
        },
        body: JSON.stringify({
          prompt: input.prompt,
          ...(input.imageDataUri ? { image: input.imageDataUri } : {}),
          resolution: "720p", // you can change to "1080p"
          duration: 5         // seconds of video
        }),
      });

      if (!response.ok) {
        throw new Error(`Runway API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      // Runway returns URLs for downloading video
      return {
        videoUrl: result.output?.[0]?.url ?? "",
      };
    } catch (err: any) {
      console.error("Video generation failed:", err);
      throw new Error("Failed to generate video");
    }
  }
);
