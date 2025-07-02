// src/ai/flows/resume-review.ts
'use server';
/**
 * @fileOverview A resume review AI agent.
 *
 * - resumeReview - A function that handles the resume review process.
 * - ResumeReviewInput - The input type for the resumeReview function.
 * - ResumeReviewOutput - The return type for the resumeReview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResumeReviewInputSchema = z.object({
  resumeText: z.string().describe('The text of the resume to review.'),
});
export type ResumeReviewInput = z.infer<typeof ResumeReviewInputSchema>;

const ResumeReviewOutputSchema = z.object({
  summary: z.string().describe('A summary of the skills, education, and key projects in the resume.'),
  suggestions: z.string().describe('Suggestions for improvement, including weak areas, missing sections, and formatting tips.'),
});
export type ResumeReviewOutput = z.infer<typeof ResumeReviewOutputSchema>;

export async function resumeReview(input: ResumeReviewInput): Promise<ResumeReviewOutput> {
  return resumeReviewFlow(input);
}

const resumeReviewPrompt = ai.definePrompt({
  name: 'resumeReviewPrompt',
  input: {schema: ResumeReviewInputSchema},
  output: {schema: ResumeReviewOutputSchema},
  prompt: `You are a resume mentor for college students. The user will upload their resume text.

  Resume Text: {{{resumeText}}}

  Return:
  1. A summary (skills, education, key projects).
  2. Suggestions for improvement (weak areas, missing sections, formatting tips).`,
});

const resumeReviewFlow = ai.defineFlow(
  {
    name: 'resumeReviewFlow',
    inputSchema: ResumeReviewInputSchema,
    outputSchema: ResumeReviewOutputSchema,
  },
  async input => {
    const {output} = await resumeReviewPrompt(input);
    return output!;
  }
);
