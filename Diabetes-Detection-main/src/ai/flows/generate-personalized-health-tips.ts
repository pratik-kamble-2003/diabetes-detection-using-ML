'use server';

/**
 * @fileOverview Generates personalized health tips based on diabetes risk assessment results.
 *
 * - generatePersonalizedHealthTips - A function that generates personalized health tips.
 * - HealthTipsInput - The input type for the generatePersonalizedHealthTips function.
 * - HealthTipsOutput - The return type for the generatePersonalizedHealthTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealthTipsInputSchema = z.object({
  riskFactors: z
    .string()
    .describe(
      'A comma-separated list of risk factors for diabetes, such as age, BMI, family history, glucose level, and blood pressure.'
    ),
  assessmentResult: z
    .string()
    .describe('The overall assessment result of the diabetes risk prediction.'),
});
export type HealthTipsInput = z.infer<typeof HealthTipsInputSchema>;

const HealthTipsOutputSchema = z.object({
  healthTips: z
    .string()
    .describe('Personalized health tips based on the diabetes risk assessment.'),
  dietRecommendation: z
    .string()
    .describe('Personalized diet recommendation based on the assessment.'),
  sugarIntakeLimit: z
    .string()
    .describe('Suggested daily sugar intake limit.'),
});
export type HealthTipsOutput = z.infer<typeof HealthTipsOutputSchema>;

export async function generatePersonalizedHealthTips(
  input: HealthTipsInput
): Promise<HealthTipsOutput> {
  return generateHealthTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedHealthTipsPrompt',
  input: {schema: HealthTipsInputSchema},
  output: {schema: HealthTipsOutputSchema},
  prompt: `You are a health advisor providing personalized health tips to users based on their diabetes risk assessment.

  Consider the following risk factors and assessment result to generate tailored advice. The advice should be directly related to the provided data.

  Risk Factors: {{{riskFactors}}}
  Assessment Result: {{{assessmentResult}}}

  Based *specifically* on the factors and result above, provide:
  1.  **Personalized Health Tips:** Actionable advice targeting the user's specific risk areas.
  2.  **Diet Recommendation:** A diet plan that considers the user's health metrics.
  3.  **Sugar Intake Limit:** A suggested daily sugar intake limit in grams, justified by the user's data.

  Be concise, practical, and ensure the output is a JSON object. The entire response should be under 200 words.
  `,
});

const generateHealthTipsFlow = ai.defineFlow(
  {
    name: 'generateHealthTipsFlow',
    inputSchema: HealthTipsInputSchema,
    outputSchema: HealthTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
