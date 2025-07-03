'use server';
/**
 * @fileOverview Calculates an internship readiness score and provides personalized tips based on a resume.
 *
 * - calculateInternshipReadiness - A function that calculates the readiness score and provides tips.
 * - InternshipReadinessInput - The input type for the calculateInternshipReadiness function.
 * - InternshipReadinessOutput - The return type for the calculateInternshipReadiness function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { saveInteraction } from '@/services/resumeService';

const InternshipReadinessInputSchema = z.object({
  resumeDataUri: z.string().describe("The user's resume, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type InternshipReadinessInput = z.infer<typeof InternshipReadinessInputSchema>;

const InternshipReadinessOutputSchema = z.object({
  score: z
    .number()
    .describe('An internship readiness score out of 100.'),
  tips:
    z.array(z.string()).describe('Personalized tips to improve internship readiness.'),
});
export type InternshipReadinessOutput = z.infer<typeof InternshipReadinessOutputSchema>;

export async function calculateInternshipReadiness(
  input: InternshipReadinessInput
): Promise<InternshipReadinessOutput> {
  return internshipReadinessFlow(input);
}

const prompt = ai.definePrompt({
  name: 'internshipReadinessPrompt',
  input: {schema: InternshipReadinessInputSchema},
  output: {schema: InternshipReadinessOutputSchema},
  prompt: `You are an expert career counselor specializing in internships.

Given the following resume (provided as an image/document), provide an Internship Readiness Score out of 100. Also give 3 personalized tips to improve their chances of getting an internship. The tips should be very specific to the resume provided.

Resume: {{media url=resumeDataUri}}`,
});

const internshipReadinessFlow = ai.defineFlow(
  {
    name: 'internshipReadinessFlow',
    inputSchema: InternshipReadinessInputSchema,
    outputSchema: InternshipReadinessOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (output) {
      await saveInteraction('internshipReadinessFlow', input, output);
    }
    return output!;
  }
);
