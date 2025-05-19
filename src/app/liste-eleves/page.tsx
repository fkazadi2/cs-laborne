
// src/app/liste-eleves/page.tsx
import { StudentListTable } from '@/components/student-list-table';
import { ListOrdered } from 'lucide-react';

export const metadata = {
  title: 'Liste des Élèves Inscrits - La Borne Connect',
  description: 'Consultez la liste de tous les élèves inscrits et leurs informations.',
};

export default function StudentListPage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-3 rounded-full mb-4">
            <ListOrdered className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">Liste des Élèves Inscrits</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Visualisez et gérez les informations des élèves inscrits à C.S. La Borne.
        </p>
      </section>
      <StudentListTable />
    </div>
  );
}
