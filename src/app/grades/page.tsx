
import { GradesForm } from '@/components/grades-form';
import { ClipboardEdit } from 'lucide-react'; // Changed icon

export const metadata = {
  title: 'Saisie des Notes par Classe - La Borne Connect', // Updated title
  description: 'Saisissez et gérez les notes des élèves par classe et par matière, et préparez la génération des bulletins scolaires.', // Updated description
};

export default function GradesPage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-3 rounded-full mb-4">
            <ClipboardEdit className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">Saisie des Notes par Classe</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Interface optimisée pour la saisie des notes par matière pour une classe entière. Calculez les moyennes et préparez les bulletins.
        </p>
      </section>
      <GradesForm />
    </div>
  );
}
