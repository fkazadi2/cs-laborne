
// src/components/dashboard-charts/StudentsByClassChart.tsx
"use client";

import { useState, useEffect } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudentCountsPerClass, subscribe, ClassData } from "@/lib/school-data-store";
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'; // Utilisation du ChartContainer de ShadCN

interface ChartData {
  name: string;
  élèves: number;
}

export function StudentsByClassChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const updateChartData = () => {
      const counts = getStudentCountsPerClass();
      setChartData(counts.map(c => ({ name: c.name, élèves: c.students })));
    };
    updateChartData();
    const unsubscribe = subscribe(updateChartData);
    return () => unsubscribe();
  }, []);
  
  const chartConfig = {
    élèves: {
      label: "Élèves",
      color: "hsl(var(--primary))",
    },
  };

  if (chartData.length === 0) {
    return (
         <Card className="shadow-lg rounded-lg">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-primary">Répartition des Élèves par Classe</CardTitle>
                <CardDescription>Nombre d'élèves dans chaque classe.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Aucune donnée de classe disponible.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">Répartition des Élèves par Classe</CardTitle>
        <CardDescription>Nombre d'élèves actuellement dans chaque classe principale.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                content={<ChartTooltipContent />} 
              />
              <Legend iconSize={10}/>
              <Bar dataKey="élèves" fill="var(--color-élèves)" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
