// This file uses server-side code.
'use server';

/**
 * @fileOverview A question answering AI agent.
 *
 * - answerUserQuestions - A function that handles the question answering process.
 * - AnswerUserQuestionsInput - The input type for the answerUserQuestions function.
 * - AnswerUserQuestionsOutput - The return type for the answerUserQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerUserQuestionsInputSchema = z.object({
  question: z.string().describe('The question to be answered.'),
});
export type AnswerUserQuestionsInput = z.infer<typeof AnswerUserQuestionsInputSchema>;

const AnswerUserQuestionsOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type AnswerUserQuestionsOutput = z.infer<typeof AnswerUserQuestionsOutputSchema>;

export async function answerUserQuestions(input: AnswerUserQuestionsInput): Promise<AnswerUserQuestionsOutput> {
  return answerUserQuestionsFlow(input);
}

const answerUserQuestionsPrompt = ai.definePrompt({
  name: 'answerUserQuestionsPrompt',
  input: {schema: AnswerUserQuestionsInputSchema},
  output: {schema: AnswerUserQuestionsOutputSchema},
  prompt: `You are a helpful AI assistant. Answer the following question to the best of your ability.\n\nQuestion: {{{question}}}`,
});

const answerUserQuestionsFlow = ai.defineFlow(
  {
    name: 'answerUserQuestionsFlow',
    inputSchema: AnswerUserQuestionsInputSchema,
    outputSchema: AnswerUserQuestionsOutputSchema,
  },
  async input => {
    const {output} = await answerUserQuestionsPrompt(input);
    return output!;
  }
);
