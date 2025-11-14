'use server';
/**
 * @fileOverview Provides real-time guidance on safe online dating practices.
 *
 * - provideSafeDatingGuidance - A function that provides safe dating advice.
 * - SafeDatingGuidanceInput - The input type for the provideSafeDatingGuidance function.
 * - SafeDatingGuidanceOutput - The return type for the provideSafeDatingGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SafeDatingGuidanceInputSchema = z.object({
  situation: z
    .string()
    .describe("A description of the current dating situation or interaction the user is in."),
});
export type SafeDatingGuidanceInput = z.infer<typeof SafeDatingGuidanceInputSchema>;

const SafeDatingGuidanceOutputSchema = z.object({
  guidance: z
    .string()
    .describe("Guidance on safe online dating practices relevant to the provided situation."),
});
export type SafeDatingGuidanceOutput = z.infer<typeof SafeDatingGuidanceOutputSchema>;

export async function provideSafeDatingGuidance(input: SafeDatingGuidanceInput): Promise<SafeDatingGuidanceOutput> {
  return provideSafeDatingGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'safeDatingGuidancePrompt',
  input: {schema: SafeDatingGuidanceInputSchema},
  output: {schema: SafeDatingGuidanceOutputSchema},
  prompt: `You are a dating safety expert. A user will describe their current dating situation. Provide clear, actionable, and concise guidance on how the user can ensure their safety, protect their personal information, and navigate the interaction ethically. Be friendly and supportive.

Situation: {{{situation}}}
`,
});

const provideSafeDatingGuidanceFlow = ai.defineFlow(
  {
    name: 'provideSafeDatingGuidanceFlow',
    inputSchema: SafeDatingGuidanceInputSchema,
    outputSchema: SafeDatingGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
