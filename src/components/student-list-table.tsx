
// src/components/student-list-table.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getRegisteredStudentDetails, subscribe, CLASSES_AVAILABLE_FOR_REGISTRATION } from '@/lib/school-data-store';
import type { StudentRegistrationFormValues } from '@/components/student-registration-form'; // Ensure this type is exported
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Users2 } from 'lucide-react';

export function StudentListTable() {
  const [registeredStudents, setRegisteredStudents] = useState<StudentRegistrationFormValues[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = () => {
      const students = getRegisteredStudentDetails();
      setRegisteredStudents(students);
      setIsLoading(false);
    };

    fetchStudents(); // Initial fetch

    const unsubscribe = subscribe(fetchStudents); // Subscribe to updates

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  const getClassName = (classId: string | undefined): string => {
    if (!classId) return 'N/A';
    const classe = CLASSES_AVAILABLE_FOR_REGISTRATION.find(c => c.id === classId);
    return classe ? classe.name : 'Classe inconnue';
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center">
            <Users2 className="mr-3 h-7 w-7" />
            Liste des Élèves
          </CardTitle>
          <CardDescription>Chargement des données des élèves...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (registeredStudents.length === 0) {
    return (
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center">
             <Users2 className="mr-3 h-7 w-7" />
            Liste des Élèves
          </CardTitle>
          <CardDescription>Consultez les informations détaillées des élèves inscrits.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-10">Aucun élève inscrit pour le moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center">
           <Users2 className="mr-3 h-7 w-7" />
           Liste des Élèves Inscrits
        </CardTitle>
        <CardDescription>
          Voici la liste des élèves ayant soumis une demande d'inscription.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[60vh] rounded-md border">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead className="font-semibold">ID Inscription</TableHead>
                <TableHead className="font-semibold">Nom</TableHead>
                <TableHead className="font-semibold">Prénom</TableHead>
                <TableHead className="font-semibold">Date de Naissance</TableHead>
                <TableHead className="font-semibold">Classe Souhaitée</TableHead>
                <TableHead className="font-semibold">Nom du Tuteur</TableHead>
                <TableHead className="font-semibold">Téléphone Tuteur</TableHead>
                <TableHead className="font-semibold">Email Tuteur</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registeredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <Badge variant="outline">{student.id}</Badge>
                  </TableCell>
                  <TableCell>{student.nomEleve}</TableCell>
                  <TableCell>{student.prenomEleve}</TableCell>
                  <TableCell>
                    {student.dateNaissance ? format(new Date(student.dateNaissance), 'P', { locale: fr }) : 'N/A'}
                  </TableCell>
                  <TableCell>{getClassName(student.classeSouhaitee)}</TableCell>
                  <TableCell>{student.nomTuteur}</TableCell>
                  <TableCell>{student.telephoneTuteur}</TableCell>
                  <TableCell>{student.emailTuteur}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
