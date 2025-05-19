
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, CalendarCheck2, ArrowRight, UserPlus } from 'lucide-react'; // Ajout de UserPlus

const features = [
  {
    icon: Users,
    title: "Portail d'Information Publique",
    description: "Accédez aux annonces de l'école, aux actualités et au calendrier des événements. Restez informé sans avoir besoin de vous connecter.",
    link: '/public',
    dataAiHint: 'community engagement'
  },
  {
    icon: UserPlus, // Nouvelle icône
    title: "Inscriptions des Élèves", // Nouveau titre
    description: "Gérez facilement les inscriptions des nouveaux élèves, soumettez les formulaires et documents nécessaires en ligne.", // Nouvelle description
    link: '/inscription-eleve', // Nouveau lien
    dataAiHint: 'student enrollment' // Nouveau hint
  },
  {
    icon: BookOpen,
    title: 'Générateur de Matériel Pédagogique',
    description: "Les enseignants peuvent créer sans effort des fiches de révision et des questions pratiques à partir du contenu des cours en utilisant l'IA.",
    link: '/learning-material',
    dataAiHint: 'education technology'
  },
  {
    icon: CalendarCheck2,
    title: 'Saisie Simplifiée des Présences',
    description: "Une interface facile à utiliser pour que les enseignants puissent rapidement marquer les présences des élèves.",
    link: '/attendance',
    dataAiHint: 'classroom management'
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* Changé lg:grid-cols-3 à md:grid-cols-2 pour 4 cartes */}
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
                    Aller à {feature.title.startsWith("Portail") || feature.title.startsWith("Générateur") || feature.title.startsWith("Saisie") ? feature.title : feature.title.replace("des Élèves", "")} {/* Simplification du texte du bouton */}
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
