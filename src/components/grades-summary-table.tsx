
// src/components/grades-summary-table.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  getClasses,
  getSubjects,
  getAllGradesForClass,
  getStudentById,
  subscribe,
  type ClassData,
  type Subject as StoreSubject,
  type Student as StoreStudent,
  type StudentGrade,
} from '@/lib/school-data-store';
import { Users, BookOpen, BarChart3, Loader2 } from 'lucide-react';

interface GradeCell {
  grade?: number;
  subjectId: string;
}

interface StudentGradesRow {
  student: StoreStudent;
  gradesBySubject: Record<string, number | undefined>; // { subjectId: grade }
  average?: number;
}

export function GradesSummaryTable() {
  const [allClasses, setAllClasses] = useState<ClassData[]>(getClasses());
  const [allSubjects, setAllSubjects] = useState<StoreSubject[]>(getSubjects());
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>(allClasses[0]?.id);
  const [gradesData, setGradesData] = useState<StudentGradesRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setIsLoading(true);
      const updatedClasses = getClasses();
      const updatedSubjects = getSubjects();
      setAllClasses(updatedClasses);
      setAllSubjects(updatedSubjects);

      if (selectedClassId) {
        const currentClassDetails = updatedClasses.find(c => c.id === selectedClassId);
        if (currentClassDetails) {
          const classGrades = getAllGradesForClass(selectedClassId);
          processGradesData(currentClassDetails.students, classGrades, updatedSubjects);
        } else {
           // Selected class might have been removed, reset or pick first
          if (updatedClasses.length > 0) {
            setSelectedClassId(updatedClasses[0].id);
          } else {
            setSelectedClassId(undefined);
            setGradesData([]);
          }
        }
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [selectedClassId]);

  const currentClass = useMemo(() => allClasses.find(c => c.id === selectedClassId), [selectedClassId, allClasses]);

  useEffect(() => {
    if (currentClass && allSubjects.length > 0) {
      setIsLoading(true);
      const classGrades = getAllGradesForClass(currentClass.id);
      processGradesData(currentClass.students, classGrades, allSubjects);
      setIsLoading(false);
    } else if (!currentClass) {
      setGradesData([]);
    }
  }, [selectedClassId, currentClass, allSubjects]); // Depend on allSubjects as well

  const processGradesData = (students: StoreStudent[], grades: StudentGrade[], subjects: StoreSubject[]) => {
    const processed: StudentGradesRow[] = students.map(student => {
      const gradesBySubject: Record<string, number | undefined> = {};
      subjects.forEach(subject => {
        const gradeEntry = grades.find(g => g.studentId === student.id && g.subjectId === subject.id);
        gradesBySubject[subject.id] = gradeEntry?.grade;
      });

      const studentGradesArray = Object.values(gradesBySubject).filter(g => g !== undefined) as number[];
      const average = studentGradesArray.length > 0 
        ? studentGradesArray.reduce((sum, grade) => sum + grade, 0) / studentGradesArray.length
        : undefined;

      return {
        student,
        gradesBySubject,
        average
      };
    });
    setGradesData(processed);
  };
  
  if (allClasses.length === 0) {
    return (
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center">
            <BarChart3 className="mr-3 h-7 w-7" /> Relevé de Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
           <p className="mt-4 text-muted-foreground">Aucune classe disponible. Veuillez en ajouter.</p>
        </CardContent>
      </Card>
    );
  }
   if (allSubjects.length === 0) {
    return (
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center">
            <BarChart3 className="mr-3 h-7 w-7" /> Relevé de Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
           <p className="mt-4 text-muted-foreground">Aucune matière disponible. Veuillez en ajouter.</p>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center">
          <BarChart3 className="mr-3 h-7 w-7" />
          Tableau Récapitulatif des Notes
        </CardTitle>
        <CardDescription>
          Sélectionnez une classe pour voir les notes des élèves par matière.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label htmlFor="class-select-summary" className="mb-2 block font-medium flex items-center">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" /> Classe
          </label>
          <Select
            value={selectedClassId}
            onValueChange={setSelectedClassId}
            disabled={isLoading}
          >
            <SelectTrigger id="class-select-summary" className="w-full md:w-1/2">
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

        {!isLoading && selectedClassId && gradesData.length > 0 && allSubjects.length > 0 && (
          <ScrollArea className="h-[60vh] w-full rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead className="font-semibold min-w-[150px]">Élève</TableHead>
                  {allSubjects.map(subject => (
                    <TableHead key={subject.id} className="font-semibold text-center min-w-[100px]">
                      {subject.name}
                    </TableHead>
                  ))}
                  <TableHead className="font-semibold text-center min-w-[100px]">Moyenne</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gradesData.map(({ student, gradesBySubject, average }) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    {allSubjects.map(subject => (
                      <TableCell key={subject.id} className="text-center">
                        {gradesBySubject[subject.id] !== undefined 
                          ? gradesBySubject[subject.id]?.toFixed(1) 
                          : '-'}
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-medium">
                        {average !== undefined ? average.toFixed(2) : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
        {!isLoading && selectedClassId && currentClass && currentClass.students.length === 0 && (
            <p className="text-muted-foreground text-center py-10">Aucun élève dans cette classe.</p>
        )}
        {!isLoading && selectedClassId && gradesData.length === 0 && currentClass && currentClass.students.length > 0 && (
            <p className="text-muted-foreground text-center py-10">Aucune note enregistrée pour cette classe.</p>
        )}
        {!isLoading && !selectedClassId && (
            <p className="text-muted-foreground text-center py-10">Veuillez sélectionner une classe pour afficher les notes.</p>
        )}
      </CardContent>
    </Card>
  );
}
