
import { TuitionManagementForm } from '@/components/tuition-management-form';
import { Landmark } from 'lucide-react';

export const metadata = {
  title: 'Gestion du Minerval - La Borne Connect',
  description: 'Suivez et gérez les paiements des frais de scolarité des élèves.',
};

export default function MinervalPage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-3 rounded-full mb-4">
            <Landmark className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">Gestion du Minerval Scolaire</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Enregistrez les paiements des frais de scolarité, consultez les soldes et l'historique des paiements pour chaque élève.
        </p>
      </section>
      <TuitionManagementForm />
    </div>
  );
}
