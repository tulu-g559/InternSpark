'use server';

/**
 * @fileOverview Generates mock HR interview questions for a given internship role.
 *
 * - generateMockHrQuestions - A function that generates mock HR interview questions.
 * - MockHrQuestionsInput - The input type for the generateMockHrQuestions function.
 * - MockHrQuestionsOutput - The return type for the generateMockHrQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { saveInteraction } from '@/services/resumeService';

const MockHrQuestionsInputSchema = z.object({
  internshipRole: z.string().describe('The internship role to generate questions for.'),
});
export type MockHrQuestionsInput = z.infer<typeof MockHrQuestionsInputSchema>;

const MockHrQuestionsOutputSchema = z.object({
  questions: z.array(z.string()).describe('An array of generated HR interview questions.'),
});
export type MockHrQuestionsOutput = z.infer<typeof MockHrQuestionsOutputSchema>;

export async function generateMockHrQuestions(
  input: MockHrQuestionsInput
): Promise<MockHrQuestionsOutput> {
  return generateMockHrQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mockHrQuestionsPrompt',
  input: {schema: MockHrQuestionsInputSchema},
  output: {schema: MockHrQuestionsOutputSchema},
  prompt: `You are an expert HR interviewer specializing in internship positions. Generate 5 HR interview questions that are relevant to a college student with limited experience applying for the role: {{{internshipRole}}}. Return the questions as a numbered list.

Example Output:
{
  "questions": [
    "1. Tell me about yourself.",
    "2. Why are you interested in this internship?",
    "3. What are your strengths and weaknesses?",
    "4. Describe a time you had to overcome a challenge.",
    "5. Where do you see yourself in 5 years?"
  ]
}`,
});

const generateMockHrQuestionsFlow = ai.defineFlow(
  {
    name: 'generateMockHrQuestionsFlow',
    inputSchema: MockHrQuestionsInputSchema,
    outputSchema: MockHrQuestionsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (output) {
      await saveInteraction('generateMockHrQuestionsFlow', input, output);
    }
    return output!;
  }
);
