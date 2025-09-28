'use server';

/**
 * @fileOverview An AI agent that suggests next actions based on defect severity and repair history after an inspection record update.
 *
 * - suggestNextActions - A function that suggests next actions based on inspection data.
 * - SuggestNextActionsInput - The input type for the suggestNextActions function.
 * - SuggestNextActionsOutput - The return type for the suggestNextActions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNextActionsInputSchema = z.object({
  defectSeverity: z
    .string()
    .describe('The severity of the defect found during inspection.'),
  repairHistory: z
    .string()
    .describe('The repair history of the component being inspected.'),
  componentType: z.string().describe('The type of the component being inspected.'),
  inspectionNotes: z.string().describe('Notes from the inspection.'),
});
export type SuggestNextActionsInput = z.infer<typeof SuggestNextActionsInputSchema>;

const SuggestNextActionsOutputSchema = z.object({
  nextActions: z
    .array(z.string())
    .describe('A list of suggested next actions based on the inspection data.'),
  reasoning: z.string().describe('The AI reasoning behind the suggested actions.'),
});
export type SuggestNextActionsOutput = z.infer<typeof SuggestNextActionsOutputSchema>;

export async function suggestNextActions(
  input: SuggestNextActionsInput
): Promise<SuggestNextActionsOutput> {
  return suggestNextActionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestNextActionsPrompt',
  input: {schema: SuggestNextActionsInputSchema},
  output: {schema: SuggestNextActionsOutputSchema},
  prompt: `You are an AI assistant that suggests next actions for railway component inspections.

  Based on the defect severity, repair history, component type, and inspection notes, provide a list of suggested next actions.
  Also, explain the reasoning behind these suggested actions.

  Defect Severity: {{{defectSeverity}}}
  Repair History: {{{repairHistory}}}
  Component Type: {{{componentType}}}
  Inspection Notes: {{{inspectionNotes}}}

  Format the output as a JSON object with 'nextActions' (an array of strings) and 'reasoning' (a string explaining the AI's reasoning).`,
});

const suggestNextActionsFlow = ai.defineFlow(
  {
    name: 'suggestNextActionsFlow',
    inputSchema: SuggestNextActionsInputSchema,
    outputSchema: SuggestNextActionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
