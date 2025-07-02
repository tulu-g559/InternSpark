// src/ai/flows/cover-letter-generator.ts
'use server';

/**
 * @fileOverview Generates a cover letter based on role, company, and resume.
 *
 * - generateCoverLetter - A function that generates a cover letter.
 * - CoverLetterInput - The input type for the generateCoverLetter function.
 * - CoverLetterOutput - The return type for the generateCoverLetter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CoverLetterInputSchema = z.object({
  roleTitle: z.string().describe('The role title for the internship.'),
  companyName: z.string().describe('The name of the company.'),
  resumeText: z.string().describe('The text of the resume.'),
});
export type CoverLetterInput = z.infer<typeof CoverLetterInputSchema>;

const CoverLetterOutputSchema = z.object({
  coverLetter: z.string().describe('The generated cover letter.'),
});
export type CoverLetterOutput = z.infer<typeof CoverLetterOutputSchema>;

export async function generateCoverLetter(input: CoverLetterInput): Promise<CoverLetterOutput> {
  return generateCoverLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'coverLetterPrompt',
  input: {schema: CoverLetterInputSchema},
  output: {schema: CoverLetterOutputSchema},
  prompt: `Generate a professional, internship-level cover letter for a student applying to the {{roleTitle}} at {{companyName}}, based on the following resume:\n\n{{resumeText}}`,
});

const generateCoverLetterFlow = ai.defineFlow(
  {
    name: 'generateCoverLetterFlow',
    inputSchema: CoverLetterInputSchema,
    outputSchema: CoverLetterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
