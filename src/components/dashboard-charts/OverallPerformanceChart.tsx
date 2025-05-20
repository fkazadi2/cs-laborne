
// src/components/dashboard-charts/OverallPerformanceChart.tsx
"use client";

import { useState, useEffect } from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip, Legend, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getOverallPerformanceSummary, subscribe } from "@/lib/school-data-store";
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface PerformanceData {
  name: string;
  value: number;
  fill: string;
}

const PASSING_THRESHOLD = 10; // Note minimale pour être considéré comme "Réussite"

export function OverallPerformanceChart() {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);

  useEffect(() => {
    const updatePerformanceData = () => {
      const summary = getOverallPerformanceSummary(PASSING_THRESHOLD);
      const data: PerformanceData[] = [];
      if (summary.passed > 0) data.push({ name: 'Réussite', value: summary.passed, fill: 'hsl(var(--chart-1))' });
      if (summary.failed > 0) data.push({ name: 'Échec', value: summary.failed, fill: 'hsl(var(--destructive))' });
      if (summary.notGraded > 0) data.push({ name: 'Non Noté', value: summary.notGraded, fill: 'hsl(var(--muted))'});
      
      setPerformanceData(data);
    };
    updatePerformanceData();
    const unsubscribe = subscribe(updatePerformanceData);
    return () => unsubscribe();
  }, []);

  const chartConfig = {
     Réussite: { label: "Réussite", color: "hsl(var(--chart-1))" },
     Échec: { label: "Échec", color: "hsl(var(--destructive))" },
     "Non Noté": { label: "Non Noté", color: "hsl(var(--muted))" }
  };
  
  if (performanceData.length === 0) {
    return (
        <Card className="shadow-lg rounded-lg">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-primary">Aperçu des Performances</CardTitle>
                <CardDescription>Proportion des évaluations (seuil: {PASSING_THRESHOLD}/20).</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Aucune donnée de performance disponible.</p>
            </CardContent>
        </Card>
    );
  }


  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">Aperçu Simplifié des Performances</CardTitle>
        <CardDescription>
          Proportion des évaluations individuelles des élèves (seuil de réussite: {PASSING_THRESHOLD}/20).
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <ChartContainer config={chartConfig} className="w-full h-full aspect-square">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip 
                cursor={{ fill: 'hsl(var(--muted))' }}
                content={<ChartTooltipContent hideLabel />} 
              />
              <Pie
                data={performanceData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine={false}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  if(value === 0) return null; // Ne pas afficher le label si la valeur est 0
                  return (
                    <text x={x} y={y} fill="hsl(var(--card-foreground))" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
                      {`${name} (${(percent * 100).toFixed(0)}%)`}
                    </text>
                  );
                }}
              >
                {performanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend 
                iconSize={10}
                formatter={(value, entry) => (
                    <span style={{ color: entry.color }}>{value} ({entry.payload.value})</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
