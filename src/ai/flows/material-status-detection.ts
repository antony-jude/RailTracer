'use server';

/**
 * @fileOverview Detects the material status of a component using an image.
 *
 * - detectMaterialStatus - A function that handles the material status detection process.
 * - DetectMaterialStatusInput - The input type for the detectMaterialStatus function.
 * - DetectMaterialStatusOutput - The return type for the detectMaterialStatus function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectMaterialStatusInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a component, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectMaterialStatusInput = z.infer<typeof DetectMaterialStatusInputSchema>;

const DetectMaterialStatusOutputSchema = z.object({
  isCorrosive: z
    .boolean()
    .describe('Whether or not the component shows signs of corrosion.'),
  materialStatusDescription: z
    .string()
    .describe('A detailed description of the material status of the component.'),
});
export type DetectMaterialStatusOutput = z.infer<typeof DetectMaterialStatusOutputSchema>;

export async function detectMaterialStatus(
  input: DetectMaterialStatusInput
): Promise<DetectMaterialStatusOutput> {
  return detectMaterialStatusFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectMaterialStatusPrompt',
  input: {schema: DetectMaterialStatusInputSchema},
  output: {schema: DetectMaterialStatusOutputSchema},
  prompt: `You are an expert in material science and corrosion analysis.

You will analyze the provided image of a component and determine its material status, particularly whether it shows signs of corrosion.

Based on your analysis, set the isCorrosive field to true if corrosion is detected, otherwise false. Provide a detailed description of the material status in the materialStatusDescription field.

Analyze the following component:

Photo: {{media url=photoDataUri}}`,
});

const detectMaterialStatusFlow = ai.defineFlow(
  {
    name: 'detectMaterialStatusFlow',
    inputSchema: DetectMaterialStatusInputSchema,
    outputSchema: DetectMaterialStatusOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
