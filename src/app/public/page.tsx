
// src/app/public/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Megaphone, Newspaper } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
  title: 'Portail Public - La Borne Connect',
  description: 'Consultez les annonces, actualités et événements de C.S. La Borne.',
};

const announcements = [
  {
    id: 1,
    title: "Réunion des Parents d'Élèves - 1ère Année",
    date: "10 Septembre 2024",
    content: "Une réunion d'information pour les parents des élèves de première année se tiendra dans la salle polyvalente. Votre présence est vivement souhaitée pour discuter du programme de l'année et rencontrer l'équipe pédagogique.",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "meeting classroom"
  },
  {
    id: 2,
    title: "Inscription aux Activités Parascolaires",
    date: "15 Septembre 2024",
    content: "Les inscriptions pour les clubs de sport, d'art et de musique sont ouvertes. Veuillez consulter le tableau d'affichage ou le secrétariat pour plus de détails et pour vous inscrire.",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "students activities"
  },
];

const newsItems = [
  {
    id: 1,
    title: "Nos Élèves Brillent au Concours de Mathématiques Régional",
    date: "5 Mai 2024",
    summary: "Félicitations à nos élèves de 12ème année qui ont remporté les premières places lors du concours de mathématiques inter-écoles. Un grand bravo pour leur travail acharné !",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "students award"
  },
  {
    id: 2,
    title: "Projet de Rénovation de la Bibliothèque",
    date: "28 Avril 2024",
    summary: "Le projet de rénovation de notre bibliothèque scolaire a débuté. Nous sommes impatients de vous offrir un espace modernisé et mieux équipé pour la lecture et l'étude.",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "library construction"
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: "Fête de Fin d'Année Scolaire",
    date: "28 Juin 2024",
    time: "14h00 - 18h00",
    location: "Cour de l'école",
    description: "Rejoignez-nous pour célébrer la fin de l'année scolaire avec des jeux, des spectacles et des rafraîchissements."
  },
  {
    id: 2,
    title: "Journée Portes Ouvertes",
    date: "7 Septembre 2024",
    time: "10h00 - 15h00",
    location: "C.S. La Borne",
    description: "Découvrez notre établissement, rencontrez nos enseignants et informez-vous sur nos programmes."
  },
  {
    id: 3,
    title: "Rentrée Scolaire 2024-2025",
    date: "9 Septembre 2024",
    time: "08h00",
    location: "C.S. La Borne",
    description: "Accueil des élèves pour la nouvelle année scolaire. Bienvenue à tous !"
  }
];

export default function PublicPortalPage() {
  return (
    <div className="space-y-12">
      <section className="text-center">
         <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-4 rounded-full mb-6">
            <Newspaper className="h-12 w-12" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
          Portail d'Information de C.S. La Borne
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Restez informés des dernières annonces, actualités et événements importants de notre communauté scolaire.
        </p>
      </section>

      {/* Section Annonces */}
      <section>
        <div className="flex items-center mb-6">
          <Megaphone className="h-8 w-8 text-primary mr-3" />
          <h2 className="text-3xl font-semibold text-primary">Annonces Récentes</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
              <CardHeader className="p-0">
                 <Image 
                    src={announcement.image} 
                    alt={`Image pour ${announcement.title}`} 
                    width={600} 
                    height={400} 
                    className="object-cover w-full h-48"
                    data-ai-hint={announcement.dataAiHint}
                  />
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-xl text-foreground mb-2">{announcement.title}</CardTitle>
                <p className="text-sm text-muted-foreground mb-3">{announcement.date}</p>
                <CardDescription className="text-base text-muted-foreground">
                  {announcement.content}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
         {announcements.length === 0 && <p className="text-muted-foreground">Aucune annonce pour le moment.</p>}
      </section>

      {/* Section Actualités */}
      <section>
         <div className="flex items-center mb-6">
          <Newspaper className="h-8 w-8 text-accent mr-3" />
          <h2 className="text-3xl font-semibold text-accent">Actualités de l'École</h2>
        </div>
        <div className="space-y-6">
          {newsItems.map((news) => (
            <Card key={news.id} className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg flex flex-col md:flex-row overflow-hidden">
              <div className="md:w-1/3">
                <Image 
                  src={news.image} 
                  alt={`Image pour ${news.title}`} 
                  width={600} 
                  height={400} 
                  className="object-cover w-full h-48 md:h-full"
                  data-ai-hint={news.dataAiHint}
                />
              </div>
              <div className="md:w-2/3">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">{news.title}</CardTitle>
                  <p className="text-sm text-muted-foreground pt-1">{news.date}</p>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted-foreground">
                    {news.summary}
                  </CardDescription>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
        {newsItems.length === 0 && <p className="text-muted-foreground">Aucune actualité pour le moment.</p>}
      </section>

      {/* Section Calendrier des Événements */}
      <section>
        <div className="flex items-center mb-6">
          <CalendarDays className="h-8 w-8 text-primary mr-3" />
          <h2 className="text-3xl font-semibold text-primary">Événements à Venir</h2>
        </div>
        <Card className="shadow-lg rounded-lg">
          <CardContent className="p-6">
            {upcomingEvents.length > 0 ? (
              <ul className="space-y-6">
                {upcomingEvents.map((event) => (
                  <li key={event.id} className="pb-6 border-b border-border last:border-b-0 last:pb-0">
                    <h3 className="text-xl font-medium text-foreground mb-1">{event.title}</h3>
                    <p className="text-sm text-primary font-semibold">
                      {event.date} {event.time && ` - ${event.time}`}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">{event.location}</p>
                    <p className="text-base text-muted-foreground">{event.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Aucun événement à venir programmé pour le moment.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
