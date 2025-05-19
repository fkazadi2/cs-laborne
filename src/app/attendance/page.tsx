
import { AttendanceForm } from '@/components/attendance-form';
import { CalendarClock } from 'lucide-react';

export const metadata = {
  title: 'Saisie des Présences - La Borne Connect',
  description: 'Saisissez facilement les présences des élèves pour les cours.',
};

export default function AttendancePage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-3 rounded-full mb-4">
            <CalendarClock className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">Saisie Simplifiée des Présences</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Les enseignants peuvent enregistrer rapidement et efficacement les présences des élèves pour chaque session de cours.
        </p>
      </section>
      <AttendanceForm />
    </div>
  );
}
