
// src/components/dashboard-charts/AttendanceTrendChart.tsx
"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';

const demoData = [
  { date: 'Lun 13/05', Présents: 28, Absents: 2, Retards: 1 },
  { date: 'Mar 14/05', Présents: 29, Absents: 1, Retards: 0 },
  { date: 'Mer 15/05', Présents: 27, Absents: 3, Retards: 2 },
  { date: 'Jeu 16/05', Présents: 30, Absents: 0, Retards: 0 },
  { date: 'Ven 17/05', Présents: 28, Absents: 1, Retards: 1 },
];

const chartConfig = {
  Présents: {
    label: "Présents",
    color: "hsl(var(--chart-1))",
  },
  Absents: {
    label: "Absents",
    color: "hsl(var(--destructive))",
  },
  Retards: {
    label: "Retards",
    color: "hsl(var(--chart-4))",
  },
};

export function AttendanceTrendChart() {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary flex items-center">
          <TrendingUp className="mr-2 h-5 w-5" />
          Tendance des Présences (Démonstration)
        </CardTitle>
        <CardDescription>Aperçu simulé des présences, absences et retards sur 5 jours.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={demoData}
              margin={{
                top: 5,
                right: 20,
                left: -20, // Adjust to make Y-axis labels visible
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip
                content={<ChartTooltipContent indicator="line" />}
              />
              <Legend iconSize={10} />
              <Line type="monotone" dataKey="Présents" stroke="var(--color-Présents)" strokeWidth={2} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="Absents" stroke="var(--color-Absents)" strokeWidth={2} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="Retards" stroke="var(--color-Retards)" strokeWidth={2} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
