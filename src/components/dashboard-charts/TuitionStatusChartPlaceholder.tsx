
// src/components/dashboard-charts/TuitionStatusChartPlaceholder.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark } from "lucide-react"; // Changed icon to Landmark

export function TuitionStatusChartPlaceholder() {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary flex items-center">
          <Landmark className="mr-2 h-5 w-5" />
          Suivi du Minerval (À venir)
        </CardTitle>
        <CardDescription>
          Visualisation du statut des paiements du minerval par élève et par semestre.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
        <Landmark className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          Le graphique de suivi du minerval sera implémenté ultérieurement.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Cette section permettra de suivre les paiements et les soldes restants.
        </p>
      </CardContent>
    </Card>
  );
}
