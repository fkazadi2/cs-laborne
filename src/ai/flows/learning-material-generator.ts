'use server';

/**
 * @fileOverview AI flow to generate flashcards and practice questions from uploaded lesson content.
 *
 * - generateLearningMaterial - A function that generates learning material from lesson content.
 * - GenerateLearningMaterialInput - The input type for the generateLearningMaterial function.
 * - GenerateLearningMaterialOutput - The return type for the generateLearningMaterial function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLearningMaterialInputSchema = z.object({
  lessonContent: z
    .string()
    .describe('The lesson content to generate flashcards and practice questions from.'),
});

export type GenerateLearningMaterialInput = z.infer<typeof GenerateLearningMaterialInputSchema>;

const GenerateLearningMaterialOutputSchema = z.object({
  flashcards: z.array(z.string()).describe('Generated flashcards from the lesson content.'),
  practiceQuestions: z
    .array(z.string())
    .describe('Generated practice questions from the lesson content.'),
});

export type GenerateLearningMaterialOutput = z.infer<typeof GenerateLearningMaterialOutputSchema>;

export async function generateLearningMaterial(
  input: GenerateLearningMaterialInput
): Promise<GenerateLearningMaterialOutput> {
  return generateLearningMaterialFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLearningMaterialPrompt',
  input: {schema: GenerateLearningMaterialInputSchema},
  output: {schema: GenerateLearningMaterialOutputSchema},
  prompt: `You are an experienced teacher. Generate flashcards and practice questions from the following lesson content.

Lesson Content: {{{lessonContent}}}

Flashcards:
{{#each flashcards}}- {{this}}
{{/each}}

Practice Questions:
{{#each practiceQuestions}}- {{this}}
{{/each}}`,
});

const generateLearningMaterialFlow = ai.defineFlow(
  {
    name: 'generateLearningMaterialFlow',
    inputSchema: GenerateLearningMaterialInputSchema,
    outputSchema: GenerateLearningMaterialOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
