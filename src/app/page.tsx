import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, CalendarCheck2, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Public Information Portal',
    description: 'Access school announcements, news, and calendar events. Stay informed without needing to log in.',
    link: '/public',
    dataAiHint: 'community engagement'
  },
  {
    icon: BookOpen,
    title: 'Learning Material Generator',
    description: 'Teachers can effortlessly create flashcards and practice questions from lesson content using AI.',
    link: '/learning-material',
    dataAiHint: 'education technology'
  },
  {
    icon: CalendarCheck2,
    title: 'Simple Attendance Input',
    description: 'An easy-to-use interface for teachers to quickly mark student attendance.',
    link: '/attendance',
    dataAiHint: 'classroom management'
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
          Welcome to La Borne Connect
        </h1>
        <p className="text-lg md:text-xl text-foreground max-w-2xl mx-auto mb-8">
          Your modern, secure, and easy-to-use school management system for C.S. La Borne.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/public">Explore Public Portal</Link>
          </Button>
        </div>
      </section>

      <section className="w-full py-12 md:py-16">
        <h2 className="text-3xl font-semibold text-center mb-10 text-primary">Core Features</h2>
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
                    Go to {feature.title}
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
