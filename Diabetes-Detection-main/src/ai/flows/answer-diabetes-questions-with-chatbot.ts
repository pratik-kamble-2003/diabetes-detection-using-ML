'use server';

/**
 * @fileOverview This file defines a Genkit flow for answering user questions about diabetes using a chatbot interface.
 *
 * - answerDiabetesQuestions - A function that handles answering diabetes-related questions.
 * - AnswerDiabetesQuestionsInput - The input type for the answerDiabetesQuestions function.
 * - AnswerDiabetesQuestionsOutput - The return type for the answerDiabetesQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerDiabetesQuestionsInputSchema = z.object({
  question: z.string().describe('The question asked by the user about diabetes.'),
  diabetesRiskResult: z.string().optional().describe('The diabetes risk result of the user.'),
});
export type AnswerDiabetesQuestionsInput = z.infer<typeof AnswerDiabetesQuestionsInputSchema>;

const AnswerDiabetesQuestionsOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question about diabetes.'),
});
export type AnswerDiabetesQuestionsOutput = z.infer<typeof AnswerDiabetesQuestionsOutputSchema>;

export async function answerDiabetesQuestions(input: AnswerDiabetesQuestionsInput): Promise<AnswerDiabetesQuestionsOutput> {
  return answerDiabetesQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerDiabetesQuestionsPrompt',
  input: {schema: AnswerDiabetesQuestionsInputSchema},
  output: {schema: AnswerDiabetesQuestionsOutputSchema},
  prompt: `You are a helpful chatbot that answers questions about diabetes.

  {% if diabetesRiskResult %}
  The user has the following diabetes risk result: {{{diabetesRiskResult}}}
  {% endif %}

  Answer the following question: {{{question}}}
  Be concise and provide helpful information.
  `,
});

const answerDiabetesQuestionsFlow = ai.defineFlow(
  {
    name: 'answerDiabetesQuestionsFlow',
    inputSchema: AnswerDiabetesQuestionsInputSchema,
    outputSchema: AnswerDiabetesQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
