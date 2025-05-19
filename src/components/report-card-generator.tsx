// src/components/report-card-generator.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from "@/hooks/use-toast";
import { Printer, Users, Loader2, CheckCircle, FileText } from 'lucide-react';
import { 
  getClasses, 
  subscribe, 
  type ClassData, 
  type Student as StoreStudent 
} from '@/lib/school-data-store';

export function ReportCardGenerator() {
  const [allClasses, setAllClasses] = useState<ClassData[]>(getClasses());
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>(allClasses[0]?.id);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setIsLoading(true);
      const updatedClasses = getClasses();
      setAllClasses(updatedClasses);

      if (selectedClassId && !updatedClasses.find(c => c.id === selectedClassId)) {
        setSelectedClassId(updatedClasses[0]?.id);
      } else if (!selectedClassId && updatedClasses.length > 0) {
        setSelectedClassId(updatedClasses[0]?.id);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [selectedClassId]);

  const currentClass = useMemo(() => allClasses.find(c => c.id === selectedClassId), [selectedClassId, allClasses]);
  const studentsInSelectedClass: StoreStudent[] = useMemo(() => {
    return currentClass?.students || [];
  }, [currentClass]);

  const handleGenerateReportCard = (student: StoreStudent) => {
    toast({
      title: "Simulation de Génération",
      description: `La génération du bulletin pour ${student.name} est simulée. Le PDF serait téléchargé ici.`,
      action: <CheckCircle className="text-green-500" />,
    });
    console.log(`Simulation: Génération du bulletin pour ${student.name} (ID: ${student.id}) de la classe ${currentClass?.name}`);
  };

  if (allClasses.length === 0) {
    return (
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center">
            <FileText className="mr-2 h-6 w-6" /> Génération des Bulletins
          </CardTitle>
        </CardHeader>
        <CardContent>
           <p className="mt-4 text-muted-foreground">Aucune classe disponible. Veuillez en ajouter.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center">
          <FileText className="mr-2 h-6 w-6" /> Préparer les Bulletins Scolaires
        </CardTitle>
        <CardDescription>
          Sélectionnez une classe pour voir la liste des élèves et simuler la génération de leurs bulletins.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label htmlFor="class-select-bulletins" className="mb-2 block font-medium flex items-center">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" /> Classe
          </label>
          <Select
            value={selectedClassId}
            onValueChange={setSelectedClassId}
            disabled={isLoading || allClasses.length === 0}
          >
            <SelectTrigger id="class-select-bulletins" className="w-full md:w-1/2">
              <SelectValue placeholder="Sélectionnez une classe" />
            </SelectTrigger>
            <SelectContent>
              {allClasses.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading && (
           <div className="flex justify-center items-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && selectedClassId && studentsInSelectedClass.length > 0 && (
          <div className="overflow-x-auto rounded-md border mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Nom de l'Élève</TableHead>
                  <TableHead className="font-semibold text-right w-[250px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentsInSelectedClass.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="py-3 font-medium">{student.name}</TableCell>
                    <TableCell className="py-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateReportCard(student)}
                        disabled={isLoading}
                      >
                        <Printer className="mr-2 h-4 w-4" />
                        Générer Bulletin (Simulation)
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        {!isLoading && selectedClassId && currentClass && currentClass.students.length === 0 && (
            <p className="text-muted-foreground text-center py-10">Aucun élève dans cette classe.</p>
        )}
        {!isLoading && !selectedClassId && (
            <p className="text-muted-foreground text-center py-10">Veuillez sélectionner une classe pour afficher les élèves.</p>
        )}

      </CardContent>
    </Card>
  );
}
