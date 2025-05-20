
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, CalendarCheck2, ArrowRight, UserPlus, ClipboardList, ListOrdered, FileText, FileSpreadsheet, BarChart3, Landmark, CalendarDays, Info, Megaphone } from 'lucide-react';
import { TotalStudentsCard } from '@/components/dashboard-charts/TotalStudentsCard';
import { StudentsByClassChart } from '@/components/dashboard-charts/StudentsByClassChart';
import { OverallPerformanceChart } from '@/components/dashboard-charts/OverallPerformanceChart';
import { AttendanceTrendChart } from '@/components/dashboard-charts/AttendanceTrendChart';
import { SemesterPerformanceChart } from '@/components/dashboard-charts/SemesterPerformanceChart';
import { TuitionStatusChartPlaceholder } from '@/components/dashboard-charts/TuitionStatusChartPlaceholder';
import { Calendar } from "@/components/ui/calendar";
import React from 'react'; // Ensure React is imported for useState

const features = [
  {
    icon: Megaphone, // Changed icon to Megaphone
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
    icon: Landmark,
    title: "Gestion du Minerval",
    description: "Suivez les paiements des frais de scolarité, gérez les soldes et générez des reçus.",
    link: '/minerval',
    dataAiHint: 'tuition fee finance'
  },
  {
    icon: BookOpen,
    title: 'Générateur de Matériel Pédagogique',
    description: "Les enseignants peuvent créer sans effort des fiches de révision et des questions pratiques à partir du contenu des cours en utilisant l'IA.",
    link: '/learning-material',
    dataAiHint: 'education technology'
  },
];

const upcomingEventsData = [
  { id: 1, date: "2024-09-05", title: "Rentrée Scolaire", description: "Accueil des élèves et début des cours pour la nouvelle année.", icon: CalendarDays, dataAiHint:"school opening" },
  { id: 2, date: "2024-10-15", title: "Réunion Parents-Professeurs (10ème)", description: "Discussion sur le progrès des élèves de 10ème année.", icon: Users, dataAiHint:"parent teacher meeting" },
  { id: 3, date: "2024-10-17", title: "Réunion Parents-Professeurs (11ème & 12ème)", description: "Discussion sur le progrès des élèves des classes terminales.", icon: Users, dataAiHint:"parent teacher meeting" },
  { id: 4, date: "2024-11-20", title: "Journée Sportive Interclasses", description: "Compétitions et activités sportives pour tous les élèves.", icon: Info, dataAiHint:"sports day" },
  { id: 5, date: "2024-12-15", title: "Excursions de Fin de Semestre", description: "Sorties éducatives pour les différentes classes.", icon: CalendarDays, dataAiHint:"field trip" },
];


export default function HomePage() {
  const [calendarDate, setCalendarDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="flex flex-col items-center justify-center">
      <section className="text-center py-12 md:py-16 w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
          Bienvenue à La Borne Connect
        </h1>
        <p className="text-lg md:text-xl text-foreground max-w-3xl mx-auto mb-8">
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

      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Colonne de Gauche (Contenu Principal): Graphiques et Fonctionnalités */}
        <main className="md:col-span-8 lg:col-span-9 space-y-12">
          <section className="w-full">
            <div className="flex items-center justify-center mb-10">
                <BarChart3 className="h-10 w-10 text-primary mr-3" />
                <h2 className="text-3xl font-semibold text-center text-primary">Aperçu Analytique</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
              <TotalStudentsCard />
              <div className="lg:col-span-2">
                <StudentsByClassChart />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <OverallPerformanceChart />
                <AttendanceTrendChart />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <SemesterPerformanceChart />
                <TuitionStatusChartPlaceholder />
            </div>
             <p className="text-sm text-muted-foreground text-center mb-10">
                Remarque : Les graphiques sur cette page utilisent des données de démonstration ou simplifiées. L'historisation complète des données de présence, la gestion par semestre et le suivi du minerval seront ajoutés ultérieurement pour des analyses plus approfondies.
            </p>
          </section>

          <section className="w-full">
            <h2 className="text-3xl font-semibold text-center mb-10 text-primary">Fonctionnalités Principales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
                            .replace("Gestion du ", "")
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
        </main>

        {/* Colonne de Droite: Calendrier et Événements */}
        <aside className="md:col-span-4 lg:col-span-3 space-y-6">
          <Card className="shadow-md rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl text-primary flex items-center">
                <CalendarDays className="mr-2 h-5 w-5" /> Calendrier Scolaire
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={calendarDate}
                onSelect={setCalendarDate}
                className="rounded-md"
                locale={require('date-fns/locale/fr').fr}
              />
            </CardContent>
          </Card>

          <Card className="shadow-md rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl text-primary flex items-center">
                <Info className="mr-2 h-5 w-5" /> Événements à Venir
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEventsData.length > 0 ? (
                upcomingEventsData.slice(0,3).map(event => ( // Limiter à 3 événements pour l'aperçu
                  <Card key={event.id} className="bg-muted/30 p-3 rounded-md shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3">
                       <event.icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                       <div>
                          <p className="text-sm font-semibold text-foreground">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{new Date(event.date + 'T00:00:00').toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                       </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Aucun événement programmé pour le moment.</p>
              )}
               {upcomingEventsData.length > 3 && (
                <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                  <Link href="/public#calendrier">Voir tous les événements</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
    

    

    