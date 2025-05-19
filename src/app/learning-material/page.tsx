
import { LearningMaterialGeneratorForm } from '@/components/learning-material-form';
import { BookOpenCheck } from 'lucide-react';

export const metadata = {
  title: 'Générateur de Matériel Pédagogique - La Borne Connect',
  description: "Générez des fiches de révision et des questions pratiques à partir du contenu des leçons en utilisant l'IA.",
};

export default function LearningMaterialPage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-3 rounded-full mb-4">
            <BookOpenCheck className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">Générateur Automatisé de Matériel Pédagogique</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Gagnez du temps dans la préparation de vos cours. Fournissez le contenu de votre leçon, et notre outil d'IA créera des fiches de révision et des questions pratiques engageantes pour vos élèves.
        </p>
      </section>
      <LearningMaterialGeneratorForm />
    </div>
  );
}
