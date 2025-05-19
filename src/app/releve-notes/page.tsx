
// src/app/releve-notes/page.tsx
import { GradesSummaryTable } from '@/components/grades-summary-table';
import { FileText } from 'lucide-react';

export const metadata = {
  title: 'Relevé de Notes - La Borne Connect',
  description: 'Consultez le récapitulatif des notes des élèves par classe et par matière.',
};

export default function GradesSummaryPage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-3 rounded-full mb-4">
            <FileText className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">Relevé de Notes des Élèves</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Visualisez les notes obtenues par les élèves pour chaque matière. Sélectionnez une classe pour afficher le détail.
        </p>
      </section>
      <GradesSummaryTable />
    </div>
  );
}
