
// src/components/dashboard-charts/TotalStudentsCard.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { getTotalRegisteredStudents, subscribe } from "@/lib/school-data-store";

export function TotalStudentsCard() {
  const [totalStudents, setTotalStudents] = useState(getTotalRegisteredStudents());

  useEffect(() => {
    const handleUpdate = () => {
      setTotalStudents(getTotalRegisteredStudents());
    };
    const unsubscribe = subscribe(handleUpdate);
    return () => unsubscribe();
  }, []);

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-primary">
          Total des Élèves Inscrits
        </CardTitle>
        <Users className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">
          {totalStudents}
        </div>
        <p className="text-xs text-muted-foreground pt-1">
          Nombre total d'élèves ayant soumis une demande d'inscription.
        </p>
      </CardContent>
    </Card>
  );
}
