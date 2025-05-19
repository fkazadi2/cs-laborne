// src/components/learning-material-form.tsx
"use client";

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, Sparkles, CheckCircle } from 'lucide-react';
import { generateLearningMaterial } from '@/ai/flows/learning-material-generator';
import type { GenerateLearningMaterialOutput } from '@/ai/flows/learning-material-generator';
import { useToast } from "@/hooks/use-toast";

export function LearningMaterialGeneratorForm() {
  const [lessonContent, setLessonContent] = useState<string>('');
  const [generatedMaterial, setGeneratedMaterial] = useState<GenerateLearningMaterialOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!lessonContent.trim()) {
      setError("Lesson content cannot be empty.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedMaterial(null);

    try {
      const result = await generateLearningMaterial({ lessonContent });
      setGeneratedMaterial(result);
      toast({
        title: "Success!",
        description: "Learning materials generated.",
        action: <CheckCircle className="text-green-500" />,
      });
    } catch (e) {
      console.error("Error generating learning material:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to generate learning materials: ${errorMessage}`);
      toast({
        variant: "destructive",
        title: "Error Generating Materials",
        description: errorMessage,
        action: <AlertTriangle className="text-red-500" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Lesson Content Input</CardTitle>
          <CardDescription>
            Paste your lesson content below. The AI will generate flashcards and practice questions based on it.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Textarea
              placeholder="Enter your lesson material here..."
              value={lessonContent}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setLessonContent(e.target.value)}
              rows={10}
              className="resize-none text-base"
              disabled={isLoading}
            />
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Materials
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {generatedMaterial && (
        <div className="space-y-8 mt-8">
          <Card className="shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Generated Flashcards</CardTitle>
            </CardHeader>
            <CardContent>
              {generatedMaterial.flashcards.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2">
                  {generatedMaterial.flashcards.map((flashcard, index) => (
                    <li key={`flashcard-${index}`} className="text-base">{flashcard}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No flashcards generated.</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Generated Practice Questions</CardTitle>
            </CardHeader>
            <CardContent>
              {generatedMaterial.practiceQuestions.length > 0 ? (
                <ol className="list-decimal pl-5 space-y-2">
                  {generatedMaterial.practiceQuestions.map((question, index) => (
                    <li key={`question-${index}`} className="text-base">{question}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-muted-foreground">No practice questions generated.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
