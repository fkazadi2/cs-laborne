
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Calendar } from "@/components/ui/calendar";
import { TotalStudentsCard } from '@/components/dashboard-charts/TotalStudentsCard';
import { StudentsByClassChart } from '@/components/dashboard-charts/StudentsByClassChart';
import { OverallPerformanceChart } from '@/components/dashboard-charts/OverallPerformanceChart';
import { AttendanceTrendChart } from '@/components/dashboard-charts/AttendanceTrendChart';
import { SemesterPerformanceChart } from '@/components/dashboard-charts/SemesterPerformanceChart';
import { TuitionStatusChartPlaceholder } from '@/components/dashboard-charts/TuitionStatusChartPlaceholder';
import { ArrowRight, BookOpen, CalendarCheck2, ClipboardList, FileSpreadsheet, FileText, Landmark, ListOrdered, Megaphone, UserPlus, CalendarDays, Newspaper, Users, Bell } from 'lucide-react';
import React from 'react';

const mainFeatures = [
  { title: 'Portail Public', description: "Consultez les annonces et nouvelles de l'école.", icon: Megaphone, href: '/public', bgColor: 'bg-sky-50', textColor: 'text-sky-700' },
  { title: 'Inscriptions des Élèves', description: "Gérez les nouvelles inscriptions et les dossiers.", icon: UserPlus, href: '/inscription-eleve', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
  { title: 'Liste des Élèves', description: "Accédez à la liste complète des élèves.", icon: ListOrdered, href: '/liste-eleves', bgColor: 'bg-amber-50', textColor: 'text-amber-700' },
  { title: 'Suivi des Présences', description: "Enregistrez et consultez les présences.", icon: CalendarCheck2, href: '/attendance', bgColor: 'bg-rose-50', textColor: 'text-rose-700' },
  { title: 'Saisie des Notes', description: "Encodez les notes des élèves par matière.", icon: ClipboardList, href: '/grades', bgColor: 'bg-fuchsia-50', textColor: 'text-fuchsia-700' },
  { title: 'Relevé des Notes', description: "Consultez le sommaire des notes.", icon: FileText, href: '/releve-notes', bgColor: 'bg-indigo-50', textColor: 'text-indigo-700' },
  { title: 'Génération des Bulletins', description: "Préparez et simulez les bulletins scolaires.", icon: FileSpreadsheet, href: '/bulletins', bgColor: 'bg-orange-50', textColor: 'text-orange-700' },
  { title: 'Gestion du Minerval', description: "Suivez les paiements des frais scolaires.", icon: Landmark, href: '/minerval', bgColor: 'bg-lime-50', textColor: 'text-lime-700' },
  { title: 'Matériel Pédagogique IA', description: "Générez fiches et questions avec l'IA.", icon: BookOpen, href: '/learning-material', bgColor: 'bg-cyan-50', textColor: 'text-cyan-700' },
];

const upcomingEventsData = [
  { date: "2024-09-05", title: "Rentrée Scolaire 2024-2025", description: "Accueil des élèves et début des cours.", icon: CalendarDays, color: "bg-blue-500" },
  { date: "2024-10-15", title: "Réunion Parents-Professeurs (10ème)", description: "Discussion sur le premier trimestre.", icon: Users, color: "bg-green-500" },
  { date: "2024-11-20", title: "Journée Sportive Interclasses", description: "Compétitions et activités ludiques.", icon: Newspaper, color: "bg-red-500" },
  { date: "2024-12-18", title: "Exposition Scientifique", description: "Présentation des projets des élèves.", icon: Bell, color: "bg-yellow-500" }
];


export default function HomePage() {
  const [calendarDate, setCalendarDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="flex flex-col space-y-6">
      <Card className="bg-card shadow-lg rounded-xl border">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Bienvenue sur La Borne Connect !</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Votre plateforme centralisée pour la gestion scolaire à C.S. La Borne.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Naviguez facilement à travers les différentes fonctionnalités pour gérer les inscriptions,
            le suivi des présences, les notes, et bien plus encore.
          </p>
        </CardContent>
      </Card>

      {/* Main content area and Right sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <main className="lg:col-span-2 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Aperçu Analytique</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TotalStudentsCard />
              <StudentsByClassChart />
              <OverallPerformanceChart />
              <AttendanceTrendChart />
              <SemesterPerformanceChart />
              <TuitionStatusChartPlaceholder />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Note: Les graphiques de tendance des présences, de performance par semestre et de suivi du minerval sont basés sur des données de démonstration.
              L'intégration de données réelles et historisées sera nécessaire pour un suivi précis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6 text-primary">Fonctionnalités Principales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mainFeatures.map((feature) => (
                <Card key={feature.title} className={`shadow-md hover:shadow-lg transition-shadow rounded-xl border ${feature.bgColor}`}>
                  <CardHeader className="pb-3">
                    <div className={`p-3 rounded-full bg-white/70 inline-block mb-3 shadow`}>
                      <feature.icon className={`h-7 w-7 ${feature.textColor}`} />
                    </div>
                    <CardTitle className={`text-lg font-semibold ${feature.textColor}`}>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <CardDescription className="text-sm text-muted-foreground mb-4 h-10">{feature.description}</CardDescription>
                  </CardContent>
                   <CardFooter>
                     <Button variant="link" asChild className={`p-0 h-auto ${feature.textColor} hover:${feature.textColor}/80`}>
                        <Link href={feature.href}>
                          Accéder <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                   </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        </main>

        {/* Right Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <Card className="shadow-md rounded-xl border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-primary flex items-center">
                <CalendarDays className="mr-2 h-5 w-5" />
                Calendrier Scolaire
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center p-0">
              <Calendar
                mode="single"
                selected={calendarDate}
                onSelect={setCalendarDate}
                className="rounded-md p-2"
                locale={require('date-fns/locale/fr').fr}
                 classNames={{
                    caption_label: "text-sm font-medium",
                    day: "h-8 w-8 text-xs", 
                    head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.7rem]", 
                    cell: "h-8 w-8 text-center text-xs p-0 relative",
                }}
              />
            </CardContent>
          </Card>

          <Card className="shadow-md rounded-xl border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-primary flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Événements à Venir
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {upcomingEventsData.slice(0, 3).map(event => (
                 <Card key={event.title} className="p-3.5 rounded-lg border shadow-sm hover:shadow-md transition-shadow bg-card flex items-start space-x-3">
                    <div className={`w-1.5 h-full min-h-[50px] rounded-full ${event.color} mt-0.5`}></div>
                    <div>
                        <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="text-sm font-semibold text-foreground">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.description}</p>
                    </div>
                </Card>
              ))}
              {upcomingEventsData.length > 3 && (
                <Button variant="link" asChild className="w-full text-primary mt-2">
                  <Link href="/public#evenements">
                    Voir tous les événements <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
              {upcomingEventsData.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Aucun événement à venir.</p>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
