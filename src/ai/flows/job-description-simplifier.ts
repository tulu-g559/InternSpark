// src/ai/flows/job-description-simplifier.ts
'use server';

/**
 * @fileOverview Job Description Simplifier AI agent.
 *
 * - simplifyJobDescription - A function that simplifies a job description.
 * - SimplifyJobDescriptionInput - The input type for the simplifyJobDescription function.
 * - SimplifyJobDescriptionOutput - The return type for the simplifyJobDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { saveInteraction } from '@/services/resumeService';

const SimplifyJobDescriptionInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The job description to be simplified.'),
});
export type SimplifyJobDescriptionInput = z.infer<
  typeof SimplifyJobDescriptionInputSchema
>;

const SimplifyJobDescriptionOutputSchema = z.object({
  summary: z.string().describe('A summary of the job description.'),
  requiredSkills: z.string().describe('The key skills required for the job.'),
  preparationTips: z
    .string()
    .describe('Tips on how a student can prepare for the job.'),
});
export type SimplifyJobDescriptionOutput = z.infer<
  typeof SimplifyJobDescriptionOutputSchema
>;

export async function simplifyJobDescription(
  input: SimplifyJobDescriptionInput
): Promise<SimplifyJobDescriptionOutput> {
  return simplifyJobDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'simplifyJobDescriptionPrompt',
  input: {schema: SimplifyJobDescriptionInputSchema},
  output: {schema: SimplifyJobDescriptionOutputSchema},
  prompt: `You are an expert career counselor specializing in helping college students understand job descriptions.

You will simplify the job description, highlight the key skills required, and provide preparation tips for a student.

Job Description: {{{jobDescription}}}

Summary of Job Description:
Required Skills:
Preparation Tips: `,
});

const simplifyJobDescriptionFlow = ai.defineFlow(
  {
    name: 'simplifyJobDescriptionFlow',
    inputSchema: SimplifyJobDescriptionInputSchema,
    outputSchema: SimplifyJobDescriptionOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (output) {
      await saveInteraction('simplifyJobDescriptionFlow', input, output);
    }
    return output!;
  }
);
