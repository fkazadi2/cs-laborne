
import { StudentRegistrationForm } from '@/components/student-registration-form';
import { UserPlus } from 'lucide-react';

export const metadata = {
  title: 'Inscription des Élèves - La Borne Connect',
  description: 'Inscrivez votre enfant à C.S. La Borne via notre formulaire en ligne.',
};

export default function StudentRegistrationPage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-3 rounded-full mb-4">
            <UserPlus className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">Inscription des Nouveaux Élèves</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Remplissez le formulaire ci-dessous pour soumettre une demande d'inscription pour votre enfant à C.S. La Borne. Assurez-vous d'avoir tous les documents nécessaires à portée de main.
        </p>
      </section>
      <StudentRegistrationForm />
    </div>
  );
}
