
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, CalendarCheck2, ArrowRight, UserPlus, ClipboardList, ListOrdered, FileText, FileSpreadsheet } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: "Portail d'Information Publique",
    description: "Accédez aux annonces de l'école, aux actualités et au calendrier des événements. Restez informé sans avoir besoin de vous connecter.",
    link: '/public',
    dataAiHint: 'community engagement'
  },
  {
    icon: UserPlus,
    title: "Inscriptions des Élèves",
    description: "Gérez facilement les inscriptions des nouveaux élèves, soumettez les formulaires et documents nécessaires en ligne.",
    link: '/inscription-eleve',
    dataAiHint: 'student enrollment'
  },
  {
    icon: ListOrdered,
    title: "Liste des Élèves Inscrits",
    description: "Consultez et gérez la liste des élèves inscrits avec leurs informations détaillées.",
    link: '/liste-eleves',
    dataAiHint: 'student database'
  },
  {
    icon: CalendarCheck2,
    title: 'Saisie Simplifiée des Présences',
    description: "Une interface facile à utiliser pour que les enseignants puissent rapidement marquer les présences des élèves.",
    link: '/attendance',
    dataAiHint: 'classroom management'
  },
  {
    icon: ClipboardList,
    title: "Saisie des Notes par Classe",
    description: "Encodez les notes par matière pour une classe entière. Calculez les moyennes et préparez les bulletins.",
    link: '/grades',
    dataAiHint: 'grade input'
  },
  {
    icon: FileText,
    title: "Relevé de Notes Détaillé",
    description: "Consultez un tableau récapitulatif des notes de chaque élève par matière pour une classe donnée.",
    link: '/releve-notes',
    dataAiHint: 'academic records'
  },
  {
    icon: FileSpreadsheet,
    title: "Génération des Bulletins Scolaires",
    description: "Préparez et générez (simulation) les bulletins de fin d'année pour chaque élève, par classe.",
    link: '/bulletins',
    dataAiHint: 'report cards'
  },
  {
    icon: BookOpen,
    title: 'Générateur de Matériel Pédagogique',
    description: "Les enseignants peuvent créer sans effort des fiches de révision et des questions pratiques à partir du contenu des cours en utilisant l'IA.",
    link: '/learning-material',
    dataAiHint: 'education technology'
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
          Bienvenue à La Borne Connect
        </h1>
        <p className="text-lg md:text-xl text-foreground max-w-2xl mx-auto mb-8">
          Votre système de gestion scolaire moderne, sécurisé et facile à utiliser pour C.S. La Borne.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/public">Explorer le Portail Public</Link>
          </Button>
           <Button size="lg" variant="outline" asChild>
            <Link href="/inscription-eleve">Inscrire un Élève</Link>
          </Button>
        </div>
      </section>

      <section className="w-full py-12 md:py-16">
        <h2 className="text-3xl font-semibold text-center mb-10 text-primary">Fonctionnalités Principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
              <CardHeader className="bg-primary/10 p-6">
                <div className="flex items-center gap-4">
                  <feature.icon className="h-10 w-10 text-primary" />
                  <CardTitle className="text-xl text-primary">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <CardDescription className="text-base text-muted-foreground mb-6">
                  {feature.description}
                </CardDescription>
              </CardContent>
              <div className="p-6 pt-0 mt-auto">
                <Button variant="outline" asChild className="w-full group">
                  <Link href={feature.link}>
                    Aller à {feature.title
                        .replace("des Élèves", "")
                        .replace("d'Information Publique", "")
                        .replace("Simplifiée des Présences", "")
                        .replace("Générateur de ", "")
                        .replace("Saisie des ", "") 
                        .replace("Liste des ", "") 
                        .replace("Relevé de ", "")
                        .replace("Génération des ", "")
                    }
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
