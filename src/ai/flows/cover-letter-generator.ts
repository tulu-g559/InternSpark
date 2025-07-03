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
import { saveInteraction } from '@/services/resumeService';

const CoverLetterInputSchema = z.object({
  roleTitle: z.string().describe('The role title for the internship.'),
  companyName: z.string().describe('The name of the company.'),
  resumeDataUri: z.string().describe("The user's resume, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
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
  prompt: `Generate a professional, internship-level cover letter for a student applying to the {{roleTitle}} at {{companyName}}. Analyze their resume provided as an image/document to tailor the letter.

Resume: {{media url=resumeDataUri}}`,
});

const generateCoverLetterFlow = ai.defineFlow(
  {
    name: 'generateCoverLetterFlow',
    inputSchema: CoverLetterInputSchema,
    outputSchema: CoverLetterOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (output) {
      await saveInteraction('generateCoverLetterFlow', input, output);
    }
    return output!;
  }
);
