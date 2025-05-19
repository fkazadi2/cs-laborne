import { LearningMaterialGeneratorForm } from '@/components/learning-material-form';
import { BookOpenCheck } from 'lucide-react';

export const metadata = {
  title: 'Learning Material Generator - La Borne Connect',
  description: 'Generate flashcards and practice questions from lesson content using AI.',
};

export default function LearningMaterialPage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-3 rounded-full mb-4">
            <BookOpenCheck className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">Automated Learning Material Generator</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Save time preparing for classes. Provide your lesson content, and our AI tool will
          create engaging flashcards and practice questions for your students.
        </p>
      </section>
      <LearningMaterialGeneratorForm />
    </div>
  );
}
