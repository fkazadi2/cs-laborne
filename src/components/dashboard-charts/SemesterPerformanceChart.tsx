
// src/components/dashboard-charts/SemesterPerformanceChart.tsx
"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Activity } from 'lucide-react';

const demoData = [
  { semester: 'Semestre 1', Réussite: 75, Échec: 25 },
  { semester: 'Semestre 2', Réussite: 82, Échec: 18 },
];

const chartConfig = {
  Réussite: {
    label: "Réussite (%)",
    color: "hsl(var(--chart-2))",
  },
  Échec: {
    label: "Échec (%)",
    color: "hsl(var(--destructive))",
  },
};

export function SemesterPerformanceChart() {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary flex items-center">
          <Activity className="mr-2 h-5 w-5" />
          Performance par Semestre (Démonstration)
        </CardTitle>
        <CardDescription>
          Comparaison simulée du taux de réussite et d'échec entre deux semestres.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
                data={demoData}
                margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="semester" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis 
                allowDecimals={false} 
                tickLine={false} 
                axisLine={false} 
                fontSize={12}
                label={{ value: '%', angle: -90, position: 'insideLeft', dx: -5 }} 
              />
              <Tooltip
                content={<ChartTooltipContent />}
              />
              <Legend iconSize={10}/>
              <Bar dataKey="Réussite" fill="var(--color-Réussite)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Échec" fill="var(--color-Échec)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
