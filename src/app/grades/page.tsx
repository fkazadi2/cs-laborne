
import { GradesForm } from '@/components/grades-form';
import { ClipboardList } from 'lucide-react';

export const metadata = {
  title: 'Gestion des Notes et Bulletins - La Borne Connect',
  description: 'Saisissez et gérez les notes des élèves, et générez les bulletins scolaires.',
};

export default function GradesPage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-3 rounded-full mb-4">
            <ClipboardList className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">Gestion des Notes et Bulletins</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Interface pour la saisie des notes par matière, le calcul des moyennes et la préparation des bulletins pour chaque élève.
        </p>
      </section>
      <GradesForm />
    </div>
  );
}
