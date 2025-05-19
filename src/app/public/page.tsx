import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, CalendarDays, Newspaper, Info } from "lucide-react";
import Image from 'next/image';

const announcements = [
  { id: 1, title: "School Reopens Monday", date: "August 15, 2024", content: "We are excited to welcome all students back for the new academic year. Please check the website for updated class schedules.", icon: Megaphone, image: "https://placehold.co/600x400.png", dataAiHint: "school opening" },
  { id: 2, title: "Parent-Teacher Meeting", date: "September 5, 2024", content: "An important meeting for parents and teachers to discuss student progress. Your presence is highly encouraged.", icon: UsersIcon, image: "https://placehold.co/600x400.png", dataAiHint: "meeting discussion"  },
];

const calendarEvents = [
  { id: 1, title: "Independence Day Celebration", date: "June 30, 2024", description: "Join us for a special assembly and cultural program to celebrate Independence Day.", icon: CalendarDays, image: "https://placehold.co/600x400.png", dataAiHint: "national celebration"  },
  { id: 2, title: "Mid-term Examinations", date: "October 10-15, 2024", description: "Mid-term exams for all grades will be conducted. Please ensure students are well-prepared.", icon: PencilRulerIcon, image: "https://placehold.co/600x400.png", dataAiHint: "exam preparation" },
  { id: 3, title: "Annual Sports Day", date: "November 20, 2024", description: "A day full of fun, games, and friendly competition. All are welcome to cheer for our students!", icon: TrophyIcon, image: "https://placehold.co/600x400.png", dataAiHint: "sports competition" },
];

const schoolNews = [
  { id: 1, title: "Science Fair Success", date: "May 25, 2024", excerpt: "Our students showcased incredible talent at the annual science fair, with several projects winning top prizes.", icon: Newspaper, image: "https://placehold.co/600x400.png", dataAiHint: "science fair"  },
  { id: 2, title: "New Library Wing Inaugurated", date: "July 10, 2024", excerpt: "The new library wing is now open, offering more resources and a quiet space for students to study and explore.", icon: LibraryIcon, image: "https://placehold.co/600x400.png", dataAiHint: "library books" },
];

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function PencilRulerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 5 4 4" />
      <path d="M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13" />
      <path d="m18 10 4 4" />
      <path d="M7.5 2.5 19 14" />
      <path d="M20.5 17.5 19 19l-1.5-1.5" />
      <path d="m13.5 6.5 1.5 1.5" />
      <path d="M2.5 7.5 14 19" />
      <path d="M19 20.5 17.5 19l-1.5 1.5" />
    </svg>
  )
}

function TrophyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}

function LibraryIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16 6 4 14" />
      <path d="M12 6v14" />
      <path d="M8 8v12" />
      <path d="M4 4v16" />
    </svg>
  )
}


export default function PublicPortalPage() {
  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Public Information Portal</h1>
        <p className="text-lg text-muted-foreground">
          Stay updated with the latest happenings at C.S. La Borne.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-primary mb-6 flex items-center gap-3">
          <Megaphone className="h-8 w-8" />
          Announcements
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {announcements.map((item) => (
            <Card key={item.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
              <Image src={item.image} alt={item.title} width={600} height={300} className="w-full h-48 object-cover" data-ai-hint={item.dataAiHint}/>
              <CardHeader>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                  <item.icon className="h-5 w-5 text-primary" />
                  <span>{item.date}</span>
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{item.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-primary mb-6 flex items-center gap-3">
          <CalendarDays className="h-8 w-8" />
          Calendar Events
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calendarEvents.map((event) => (
            <Card key={event.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
              <Image src={event.image} alt={event.title} width={600} height={300} className="w-full h-48 object-cover" data-ai-hint={event.dataAiHint}/>
              <CardHeader>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                  <event.icon className="h-5 w-5 text-accent" />
                   <span>{event.date}</span>
                </div>
                <CardTitle className="text-xl">{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{event.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        {calendarEvents.length === 0 && (
          <Card className="text-center p-6 text-muted-foreground">
            <Info className="mx-auto h-12 w-12 mb-4" />
            No upcoming events at the moment. Please check back later.
          </Card>
        )}
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-primary mb-6 flex items-center gap-3">
          <Newspaper className="h-8 w-8" />
          School News
        </h2>
        <div className="space-y-6">
          {schoolNews.map((newsItem) => (
            <Card key={newsItem.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden md:flex">
              <Image src={newsItem.image} alt={newsItem.title} width={300} height={200} className="w-full md:w-1/3 h-48 md:h-auto object-cover" data-ai-hint={newsItem.dataAiHint}/>
              <div className="md:w-2/3">
                <CardHeader>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                    <newsItem.icon className="h-5 w-5 text-primary" />
                    <span>{newsItem.date}</span>
                  </div>
                  <CardTitle className="text-xl">{newsItem.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{newsItem.excerpt}</p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
