'use server';
/**
 * @fileOverview Text content generation flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// --------- Input/Output Schemas ----------
const GenerateContentInputSchema = z.object({
  prompt: z.string().min(1).describe('The prompt to generate text content.'),
});
export type GenerateContentInput = z.infer<typeof GenerateContentInputSchema>;

const GenerateContentOutputSchema = z.object({
  content: z.string().describe('The generated text content.'),
});
export type GenerateContentOutput = z.infer<typeof GenerateContentOutputSchema>;

// --------- Public API ----------
export async function generateContent(
  input: GenerateContentInput
): Promise<GenerateContentOutput> {
  return generateContentFlow(input);
}

// --------- Flow Definition ----------
const generateContentFlow = ai.defineFlow(
  {
    name: 'generateContentFlow',
    inputSchema: GenerateContentInputSchema,
    outputSchema: GenerateContentOutputSchema,
  },
  async input => {
    // Use the default model configured in ai/genkit.ts unless overridden here
    const result = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      prompt: input.prompt,
    });

    // Try common return fields, fallback to string coercion if needed
    const content = (result as any).text ?? (result as any).output ?? '';

    if (!content || typeof content !== 'string') {
      throw new Error('Failed to generate content.');
    }

    return { content };
  }
);
