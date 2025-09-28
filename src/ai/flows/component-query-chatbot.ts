'use server';

/**
 * @fileOverview This file defines a Genkit flow for an AI chatbot that answers questions about components, inspections, and procedures.
 *
 * - componentQueryChatbot - The main function to query the chatbot.
 * - ComponentQueryChatbotInput - The input type for the componentQueryChatbot function.
 * - ComponentQueryChatbotOutput - The output type for the componentQueryChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ComponentQueryChatbotInputSchema = z.object({
  query: z.string().describe('The user query about components, inspections, or procedures.'),
});
export type ComponentQueryChatbotInput = z.infer<typeof ComponentQueryChatbotInputSchema>;

const ComponentQueryChatbotOutputSchema = z.object({
  answer: z.string().describe('The chatbot answer to the user query.'),
});
export type ComponentQueryChatbotOutput = z.infer<typeof ComponentQueryChatbotOutputSchema>;

export async function componentQueryChatbot(input: ComponentQueryChatbotInput): Promise<ComponentQueryChatbotOutput> {
  return componentQueryChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'componentQueryChatbotPrompt',
  input: {schema: ComponentQueryChatbotInputSchema},
  output: {schema: ComponentQueryChatbotOutputSchema},
  prompt: `You are a helpful AI chatbot that answers questions about railway components, inspections, and procedures.

  User Query: {{{query}}}
  `,
});

const componentQueryChatbotFlow = ai.defineFlow(
  {
    name: 'componentQueryChatbotFlow',
    inputSchema: ComponentQueryChatbotInputSchema,
    outputSchema: ComponentQueryChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
