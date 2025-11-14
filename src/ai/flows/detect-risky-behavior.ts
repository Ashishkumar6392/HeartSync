// Detects toxic or risky behavior patterns in messages and alerts users to potentially harmful interactions.

'use server';

/**
 * @fileOverview This file defines a Genkit flow for detecting risky behavior in user messages.
 *
 * - detectRiskyBehavior - Function to analyze a message and determine if it contains risky behavior.
 * - DetectRiskyBehaviorInput - The input type for the detectRiskyBehavior function.
 * - DetectRiskyBehaviorOutput - The output type for the detectRiskyBehavior function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectRiskyBehaviorInputSchema = z.object({
  message: z.string().describe('The message content to be analyzed.'),
  userContext: z
    .string()
    .optional()
    .describe('Context about the user sending the message.'),
  matchContext: z
    .string()
    .optional()
    .describe('Context about the match receiving the message.'),
});
export type DetectRiskyBehaviorInput = z.infer<typeof DetectRiskyBehaviorInputSchema>;

const DetectRiskyBehaviorOutputSchema = z.object({
  isRisky: z.boolean().describe('Whether the message is considered risky.'),
  riskFactors: z.array(z.string()).describe('Specific risk factors identified in the message.'),
  explanation: z
    .string()
    .optional()
    .describe('Explanation of why the message is considered risky.'),
});
export type DetectRiskyBehaviorOutput = z.infer<typeof DetectRiskyBehaviorOutputSchema>;

export async function detectRiskyBehavior(
  input: DetectRiskyBehaviorInput
): Promise<DetectRiskyBehaviorOutput> {
  return detectRiskyBehaviorFlow(input);
}

const detectRiskyBehaviorPrompt = ai.definePrompt({
  name: 'detectRiskyBehaviorPrompt',
  input: {schema: DetectRiskyBehaviorInputSchema},
  output: {schema: DetectRiskyBehaviorOutputSchema},
  prompt: `You are an AI assistant specializing in detecting toxic or risky behavior in online dating app messages.

  Analyze the following message and determine if it contains any risky behavior patterns. Consider factors such as harassment, hate speech, sexually explicit content, dangerous content, or any other unethical or harmful language.

  Message: {{{message}}}
  User Context: {{{userContext}}}
  Match Context: {{{matchContext}}}

  Provide a detailed explanation of why the message is considered risky and list the specific risk factors identified.

  Respond in a JSON format that conforms to the following schema:
  {
    "isRisky": boolean,
    "riskFactors": string[],
    "explanation": string
  }`,
});

const detectRiskyBehaviorFlow = ai.defineFlow(
  {
    name: 'detectRiskyBehaviorFlow',
    inputSchema: DetectRiskyBehaviorInputSchema,
    outputSchema: DetectRiskyBehaviorOutputSchema,
  },
  async input => {
    const {output} = await detectRiskyBehaviorPrompt(input);
    return output!;
  }
);
