
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar } from "@/components/ui/calendar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { ArrowRight, BookOpenText, Activity, ChevronRight, Book, Users, TrendingUp, Clock, ChevronLeft } from 'lucide-react';
import React from 'react';

const onGoingCoursesData = [
  {
    title: "Higher Algebra",
    instructor: "Sarah Jane",
    progress: 74,
    image: "https://placehold.co/600x400/a0c4ff/4A5568.png?text=Math", // Pale blueish
    dataAiHint: "mathematics algebra",
    bgColorClass: "bg-blue-50",
    textColorClass: "text-blue-700",
    progressColor: "bg-blue-500",
  },
  {
    title: "Computer Fundamental",
    instructor: "Amelia Rose",
    progress: 50,
    image: "https://placehold.co/600x400/c7d2fe/4A5568.png?text=CS", // Pale purpleish
    dataAiHint: "computer science",
    bgColorClass: "bg-indigo-50",
    textColorClass: "text-indigo-700",
    progressColor: "bg-indigo-500",
  },
  {
    title: "English for Everyone",
    instructor: "Elizabeth Ann",
    progress: 62,
    image: "https://placehold.co/600x400/fbcfe8/4A5568.png?text=Eng", // Pale pinkish
    dataAiHint: "english language",
    bgColorClass: "bg-pink-50",
    textColorClass: "text-pink-700",
    progressColor: "bg-pink-500",
  },
];

const studyStatisticsData = [
  { name: 'Sun', higherAlgebra: 4, computerFundamental: 2.4, englishForEveryone: 2.4 },
  { name: 'Mon', higherAlgebra: 3, computerFundamental: 1.3, englishForEveryone: 2.2 },
  { name: 'Tue', higherAlgebra: 2, computerFundamental: 6.8, englishForEveryone: 2.2 }, // Adjusted data for visual interest
  { name: 'Wed', higherAlgebra: 2.7, computerFundamental: 3.9, englishForEveryone: 2 },
  { name: 'Thu', higherAlgebra: 1.8, computerFundamental: 4.8, englishForEveryone: 2.1 },
  { name: 'Fri', higherAlgebra: 2.3, computerFundamental: 3.8, englishForEveryone: 2.5 },
  { name: 'Sat', higherAlgebra: 3.4, computerFundamental: 4.3, englishForEveryone: 2.1 },
];

const chartConfig = {
  higherAlgebra: { label: "Higher Algebra", color: "hsl(var(--chart-1))" },
  computerFundamental: { label: "Computer Fundamental", color: "hsl(var(--chart-2))" },
  englishForEveryone: { label: "English for Everyone", color: "hsl(var(--chart-3))" },
};


const remainingHomeworkData = [
  { title: "Linear Transformation", deadline: "Deadline: March 09, 2023", progress: 25, icon: BookOpenText, iconColor: "text-orange-500", bgColor: "bg-orange-50" },
  { title: "Problem Solving with C", deadline: "Deadline: March 10, 2023", progress: 50, icon: Activity, iconColor: "text-teal-500", bgColor: "bg-teal-50" },
];

const upcomingClassesData = [
  { time: "09:00 AM - 10:00 AM", title: "Higher Algebra", instructor: "Sarah Jane", color: "bg-blue-500" },
  { time: "10:00 AM - 11:00 AM", title: "Computer Fundamental", instructor: "Amelia Rose", color: "bg-indigo-500" },
  { time: "11:00 AM - 12:00 PM", title: "English for Everyone", instructor: "Elizabeth Ann", color: "bg-pink-500" },
];


export default function HomePage() {
  const [calendarDate, setCalendarDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="flex flex-col space-y-6">
      {/* Main content area and Right sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <main className="lg:col-span-2 space-y-6">
          {/* On Going Courses */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">On Going Courses</h2>
              <Button variant="link" className="text-sm text-primary p-0 h-auto hover:text-primary/80">See All</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {onGoingCoursesData.map((course) => (
                <Card key={course.title} className={`overflow-hidden shadow-md hover:shadow-lg transition-shadow rounded-xl border ${course.bgColorClass}`}>
                  <CardHeader className="p-0">
                    <Image
                      src={course.image}
                      alt={course.title}
                      width={600}
                      height={300} // Adjusted height for a more common aspect ratio
                      className="w-full h-32 object-cover" // Fixed height for consistency
                      data-ai-hint={course.dataAiHint}
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className={`text-md font-semibold mb-1 ${course.textColorClass}`}>{course.title}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mb-3">{course.instructor}</CardDescription>
                    <div className="flex items-center justify-between text-xs">
                        <Progress value={course.progress} className={`h-1.5 ${course.progressColor}`} indicatorClassName={course.progressColor}/>
                        <span className={`ml-2 font-medium ${course.textColorClass}`}>{course.progress}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Study Statistics */}
          <section>
            <Card className="shadow-md hover:shadow-lg transition-shadow rounded-xl border">
              <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold">Study Statistics</CardTitle>
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">Last Week <ChevronRight className="h-3 w-3 ml-1 opacity-50"/></Button>
                </div>
              </CardHeader>
              <CardContent className="h-[300px] pl-0 pr-4 pb-4">
                 <ChartContainer config={chartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={studyStatisticsData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} dy={10} />
                        <YAxis tickFormatter={(value) => `${value}h`} tickLine={false} axisLine={false} fontSize={12} width={40}/>
                        <Tooltip content={<ChartTooltipContent indicator="line" />} />
                        <Legend iconType="circle" iconSize={8} wrapperStyle={{paddingTop: 20}}/>
                        <Line type="monotone" dataKey="higherAlgebra" stroke="var(--color-higherAlgebra)" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                        <Line type="monotone" dataKey="computerFundamental" stroke="var(--color-computerFundamental)" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                        <Line type="monotone" dataKey="englishForEveryone" stroke="var(--color-englishForEveryone)" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                 </ChartContainer>
              </CardContent>
            </Card>
          </section>

          {/* Remaining Homework */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Remaining Homework</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {remainingHomeworkData.map((homework) => (
                <Card key={homework.title} className={`shadow-md hover:shadow-lg transition-shadow rounded-xl border ${homework.bgColor}`}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className={`p-2.5 rounded-lg mr-3 ${homework.iconColor} bg-white`}>
                            <homework.icon className="h-5 w-5"/>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground">{homework.title}</p>
                            <p className="text-xs text-muted-foreground">{homework.deadline}</p>
                        </div>
                    </div>
                     <div className="flex items-center">
                        <div className="relative h-8 w-8 mr-2">
                            <PieChart width={32} height={32}>
                                <Pie
                                    data={[{ name: 'Completed', value: homework.progress }, { name: 'Remaining', value: 100 - homework.progress }]}
                                    cx="50%" cy="50%" innerRadius={10} outerRadius={14} dataKey="value"
                                    paddingAngle={0}
                                    startAngle={90}
                                    endAngle={90 + 360 * (homework.progress/100) - (homework.progress === 100 ? 0 : 3)} // Small gap if not 100%
                                >
                                <Cell fill={homework.progress === 100 ? "hsl(var(--chart-1))" : "hsl(var(--chart-1))"} />
                                <Cell fill="hsl(var(--muted) / 0.3)" />
                                </Pie>
                                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-[10px] font-semibold fill-foreground">
                                {`${homework.progress}%`}
                                </text>
                            </PieChart>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted/50">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </main>

        {/* Right Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <Card className="shadow-md rounded-xl border">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold">Upcoming Classes</CardTitle>
                <div className="flex space-x-1">
                    <Button variant="outline" size="icon" className="h-7 w-7"><ChevronLeft className="h-4 w-4"/></Button>
                    <Button variant="outline" size="icon" className="h-7 w-7"><ChevronRight className="h-4 w-4"/></Button>
                </div>
              </div>
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
                    day: "h-8 w-8 text-xs", // Smaller days
                    head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.7rem]", // Smaller head cells
                    cell: "h-8 w-8 text-center text-xs p-0 relative",
                }}
              />
            </CardContent>
          </Card>

          <div className="space-y-3">
            {upcomingClassesData.map(event => (
              <Card key={event.title} className="p-3.5 rounded-xl border shadow-sm hover:shadow-md transition-shadow bg-card">
                <div className="flex items-start space-x-3">
                    <div className={`w-1.5 h-10 rounded-full ${event.color} mt-0.5`}></div>
                    <div>
                        <p className="text-xs text-muted-foreground">{event.time}</p>
                        <p className="text-sm font-semibold text-foreground">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.instructor}</p>
                    </div>
                </div>
              </Card>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
