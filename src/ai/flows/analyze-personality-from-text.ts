'use server';

/**
 * @fileOverview Analyzes personality traits from user text input.
 *
 * - analyzePersonalityFromText - Function to analyze personality from text.
 * - AnalyzePersonalityFromTextInput - Input type for the function.
 * - AnalyzePersonalityFromTextOutput - Output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePersonalityFromTextInputSchema = z.object({
  text: z.string().describe('The text input from the user to analyze.'),
});

export type AnalyzePersonalityFromTextInput = z.infer<
  typeof AnalyzePersonalityFromTextInputSchema
>;

const AnalyzePersonalityFromTextOutputSchema = z.object({
  personalityTraits: z
    .string()
    .describe(
      'A summary of the personality traits identified in the text input.'
    ),
});

export type AnalyzePersonalityFromTextOutput = z.infer<
  typeof AnalyzePersonalityFromTextOutputSchema
>;

export async function analyzePersonalityFromText(
  input: AnalyzePersonalityFromTextInput
): Promise<AnalyzePersonalityFromTextOutput> {
  return analyzePersonalityFromTextFlow(input);
}

const analyzePersonalityFromTextPrompt = ai.definePrompt({
  name: 'analyzePersonalityFromTextPrompt',
  input: {schema: AnalyzePersonalityFromTextInputSchema},
  output: {schema: AnalyzePersonalityFromTextOutputSchema},
  prompt: `Analyze the following text and identify the personality traits of the person who wrote it. Provide a summary of these traits.\n\nText: {{{text}}}`,
});

const analyzePersonalityFromTextFlow = ai.defineFlow(
  {
    name: 'analyzePersonalityFromTextFlow',
    inputSchema: AnalyzePersonalityFromTextInputSchema,
    outputSchema: AnalyzePersonalityFromTextOutputSchema,
  },
  async input => {
    const {output} = await analyzePersonalityFromTextPrompt(input);
    return output!;
  }
);
