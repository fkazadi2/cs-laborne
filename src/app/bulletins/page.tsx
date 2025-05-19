// src/app/bulletins/page.tsx
import { ReportCardGenerator } from '@/components/report-card-generator';
import { FileSpreadsheet } from 'lucide-react';

export const metadata = {
  title: 'Génération des Bulletins Scolaires - La Borne Connect',
  description: 'Générez les bulletins de fin d\'année pour les élèves, classe par classe.',
};

export default function BulletinsPage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-3 rounded-full mb-4">
            <FileSpreadsheet className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">Génération des Bulletins Scolaires</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Sélectionnez une classe pour préparer et simuler la génération des bulletins de fin d'année pour chaque élève.
        </p>
      </section>
      <ReportCardGenerator />
    </div>
  );
}
