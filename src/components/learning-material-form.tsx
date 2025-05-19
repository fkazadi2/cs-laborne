
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
      setError("Le contenu de la leçon ne peut pas être vide.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedMaterial(null);

    try {
      const result = await generateLearningMaterial({ lessonContent });
      setGeneratedMaterial(result);
      toast({
        title: "Succès !",
        description: "Matériel pédagogique généré.",
        action: <CheckCircle className="text-green-500" />,
      });
    } catch (e) {
      console.error("Erreur lors de la génération du matériel pédagogique:", e);
      const errorMessage = e instanceof Error ? e.message : "Une erreur inconnue s'est produite.";
      setError(`Échec de la génération du matériel pédagogique : ${errorMessage}`);
      toast({
        variant: "destructive",
        title: "Erreur lors de la Génération du Matériel",
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
          <CardTitle className="text-2xl text-primary">Saisie du Contenu de la Leçon</CardTitle>
          <CardDescription>
            Collez le contenu de votre leçon ci-dessous. L'IA générera des fiches de révision et des questions pratiques basées sur celui-ci.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Textarea
              placeholder="Entrez le contenu de votre leçon ici..."
              value={lessonContent}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setLessonContent(e.target.value)}
              rows={10}
              className="resize-none text-base"
              disabled={isLoading}
            />
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Générer le Matériel
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
              <CardTitle className="text-2xl text-primary">Fiches de Révision Générées</CardTitle>
            </CardHeader>
            <CardContent>
              {generatedMaterial.flashcards.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2">
                  {generatedMaterial.flashcards.map((flashcard, index) => (
                    <li key={`flashcard-${index}`} className="text-base">{flashcard}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Aucune fiche de révision générée.</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Questions Pratiques Générées</CardTitle>
            </CardHeader>
            <CardContent>
              {generatedMaterial.practiceQuestions.length > 0 ? (
                <ol className="list-decimal pl-5 space-y-2">
                  {generatedMaterial.practiceQuestions.map((question, index) => (
                    <li key={`question-${index}`} className="text-base">{question}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-muted-foreground">Aucune question pratique générée.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
