'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting profile improvements.
 *
 * - suggestProfileImprovements - Analyzes a user profile and provides personalized tips for improvement.
 * - SuggestProfileImprovementsInput - The input type for the suggestProfileImprovements function.
 * - SuggestProfileImprovementsOutput - The return type for the suggestProfileImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProfileImprovementsInputSchema = z.object({
  profileText: z
    .string()
    .describe('The text description of the user profile.'),
  profileVideoDataUri: z
    .string()
    .optional()
    .describe(
      "A video of the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  profileAudioDataUri: z
    .string()
    .optional()
    .describe(
      "An audio recording of the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SuggestProfileImprovementsInput = z.infer<
  typeof SuggestProfileImprovementsInputSchema
>;

const SuggestProfileImprovementsOutputSchema = z.object({
  textSuggestions: z
    .array(z.string())
    .describe('Suggestions for improving the text portion of the profile.'),
  videoSuggestions: z
    .array(z.string())
    .describe('Suggestions for improving the video portion of the profile.'),
  audioSuggestions: z
    .array(z.string())
    .describe('Suggestions for improving the audio portion of the profile.'),
});
export type SuggestProfileImprovementsOutput = z.infer<
  typeof SuggestProfileImprovementsOutputSchema
>;

export async function suggestProfileImprovements(
  input: SuggestProfileImprovementsInput
): Promise<SuggestProfileImprovementsOutput> {
  return suggestProfileImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProfileImprovementsPrompt',
  input: {schema: SuggestProfileImprovementsInputSchema},
  output: {schema: SuggestProfileImprovementsOutputSchema},
  prompt: `You are an expert dating profile consultant.

  Analyze the provided user profile information (text, video, and audio, if available) and provide specific, actionable suggestions for improvement in each area.

  Focus on aspects like:
  * Clarity and conciseness of the profile text
  * Engaging and authentic self-presentation in the video
  * Audio quality and speaking style in the audio recording
  * Lighting and background in the video, suggesting improvements for visual appeal

  Text Profile: {{{profileText}}}
  {{#if profileVideoDataUri}}
  Video: {{media url=profileVideoDataUri}}
  {{/if}}
  {{#if profileAudioDataUri}}
  Audio: {{media url=profileAudioDataUri}}
  {{/if}}

  Provide suggestions in the following JSON format:
  {textSuggestions: string[], videoSuggestions: string[], audioSuggestions: string[]}
  `,
});

const suggestProfileImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestProfileImprovementsFlow',
    inputSchema: SuggestProfileImprovementsInputSchema,
    outputSchema: SuggestProfileImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
