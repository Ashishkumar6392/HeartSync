'use server';
/**
 * @fileOverview Generates engaging conversation starters tailored for video and voice chats.
 *
 * - generateConversationStarters - A function that generates conversation starters.
 * - GenerateConversationStartersInput - The input type for the generateConversationStarters function.
 * - GenerateConversationStartersOutput - The return type for the generateConversationStarters function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateConversationStartersInputSchema = z.object({
  matchProfile: z.string().describe('The profile information of the match.'),
});
export type GenerateConversationStartersInput = z.infer<typeof GenerateConversationStartersInputSchema>;

const GenerateConversationStartersOutputSchema = z.object({
  conversationStarters: z
    .array(z.string())
    .describe('A list of engaging conversation starters.'),
});
export type GenerateConversationStartersOutput = z.infer<typeof GenerateConversationStartersOutputSchema>;

export async function generateConversationStarters(
  input: GenerateConversationStartersInput
): Promise<GenerateConversationStartersOutput> {
  return generateConversationStartersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateConversationStartersPrompt',
  input: {schema: GenerateConversationStartersInputSchema},
  output: {schema: GenerateConversationStartersOutputSchema},
  prompt: `You are a dating assistant expert. Generate a list of engaging conversation starters for a user to use in a video or voice chat with their match.

  Consider the following profile information of the match when generating the conversation starters:
  {{matchProfile}}

  Return an array of at least 3 conversation starters. Make sure they are open-ended questions that encourage the match to talk about themselves and share their interests.`,
});

const generateConversationStartersFlow = ai.defineFlow(
  {
    name: 'generateConversationStartersFlow',
    inputSchema: GenerateConversationStartersInputSchema,
    outputSchema: GenerateConversationStartersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
