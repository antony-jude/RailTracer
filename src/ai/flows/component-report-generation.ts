'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a comprehensive AI report about a railway component.
 *
 * - generateComponentReport - The main function to generate the report.
 * - GenerateComponentReportInput - The input type for the generateComponentReport function.
 * - GenerateComponentReportOutput - The output type for the generateComponentReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { RailwayComponent, Inspection } from '@/lib/types';

const GenerateComponentReportInputSchema = z.object({
  component: z.any().describe('The railway component object.'),
});
export type GenerateComponentReportInput = {
    component: RailwayComponent;
};

const GenerateComponentReportOutputSchema = z.object({
  report: z.string().describe('A comprehensive report in Markdown format.'),
});
export type GenerateComponentReportOutput = z.infer<typeof GenerateComponentReportOutputSchema>;

export async function generateComponentReport(input: GenerateComponentReportInput): Promise<GenerateComponentReportOutput> {
  // Manually construct the prompt content since the component object is complex
  const { component } = input;
  const inspectionHistory = component.history.map(h => `- ${h.date}: ${h.status} by ${h.inspector}. Notes: ${h.notes}`).join('\n');

  const promptText = `
    You are an AI assistant that generates comprehensive reports for railway components.
    Analyze the provided data and generate a detailed report in Markdown format.

    The report should include:
    1.  A summary of the component's current status and key details.
    2.  An analysis of the inspection history, highlighting any patterns or recurring issues.
    3.  Information about the vendor and warranty status, with an assessment of any risks.
    4.  An inventory management recommendation (e.g., "Monitor", "Schedule for replacement", "Immediate action required").

    Component Details:
    - ID: ${component.id}
    - Name: ${component.name}
    - Type: ${component.type}
    - Location: ${component.location}
    - Install Date: ${component.installDate}
    - Current Status: ${component.currentState}
    - Vendor: ${component.vendor}
    - Warranty Until: ${component.warrantyUntil}
    - Supply Date: ${component.supplyDate}

    Inspection History:
    ${inspectionHistory}
  `;
  
  return generateComponentReportFlow({prompt: promptText});
}

const flowInputSchema = z.object({
    prompt: z.string()
});

const prompt = ai.definePrompt({
  name: 'generateComponentReportPrompt',
  input: {schema: flowInputSchema},
  output: {schema: GenerateComponentReportOutputSchema},
  prompt: `{{{prompt}}}`,
});

const generateComponentReportFlow = ai.defineFlow(
  {
    name: 'generateComponentReportFlow',
    inputSchema: flowInputSchema,
    outputSchema: GenerateComponentReportOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
