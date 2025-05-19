
// src/components/grades-form.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle, Loader2, Save, ClipboardEdit, BookOpen, Users } from 'lucide-react';
import { 
  getClasses, 
  getSubjects, 
  subscribe, 
  setStudentGrade,
  getStudentGrade,
  type ClassData, 
  type Subject as StoreSubject, 
  type Student as StoreStudent 
} from '@/lib/school-data-store';

// Simplified student structure for this form
interface StudentSimple extends Pick<StoreStudent, 'id' | 'name'> {}

export function GradesForm() {
  const [allClasses, setAllClasses] = useState<ClassData[]>(getClasses());
  const [allSubjects, setAllSubjects] = useState<StoreSubject[]>(getSubjects());

  const [selectedClassId, setSelectedClassId] = useState<string | undefined>(allClasses[0]?.id);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | undefined>(allSubjects[0]?.id);
  
  // Store grades as { [studentId]: grade_value_as_string }
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      const updatedClassesFromStore = getClasses();
      setAllClasses(updatedClassesFromStore);

      // If selected class is removed, reset or pick first
      if (selectedClassId && !updatedClassesFromStore.find(c => c.id === selectedClassId)) {
        setSelectedClassId(updatedClassesFromStore[0]?.id);
      } else if (!selectedClassId && updatedClassesFromStore.length > 0) {
        setSelectedClassId(updatedClassesFromStore[0]?.id);
      }
    });
    return () => unsubscribe();
  }, [selectedClassId]);

  const currentClass = useMemo(() => allClasses.find(c => c.id === selectedClassId), [selectedClassId, allClasses]);
  const studentsInSelectedClass: StudentSimple[] = useMemo(() => {
    return currentClass?.students.map(s => ({ id: s.id, name: s.name })) || [];
  }, [currentClass]);

  // Pre-fill grades when class or subject changes
  useEffect(() => {
    if (selectedClassId && selectedSubjectId && studentsInSelectedClass.length > 0) {
      const newGrades: Record<string, string> = {};
      studentsInSelectedClass.forEach(student => {
        const existingGrade = getStudentGrade(selectedClassId, student.id, selectedSubjectId);
        newGrades[student.id] = existingGrade !== undefined ? String(existingGrade) : '';
      });
      setGrades(newGrades);
    } else {
      setGrades({}); // Reset grades if no class/subject or no students
    }
  }, [selectedClassId, selectedSubjectId, studentsInSelectedClass]);


  const handleGradeChange = (studentId: string, value: string) => {
    setGrades(prevGrades => ({
      ...prevGrades,
      [studentId]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedClassId || !selectedSubjectId || studentsInSelectedClass.length === 0) {
      toast({
        variant: "destructive",
        title: "Informations Manquantes",
        description: "Veuillez sélectionner une classe et une matière.",
        action: <AlertTriangle className="text-red-500" />,
      });
      return;
    }

    let allGradesValid = true;
    for (const studentId in grades) {
      const gradeStr = grades[studentId];
      if (gradeStr.trim() === '') continue; // Allow empty grades (not yet graded)

      const numericGrade = parseFloat(gradeStr);
      if (isNaN(numericGrade) || numericGrade < 0 || numericGrade > 20) {
        allGradesValid = false;
        const student = studentsInSelectedClass.find(s => s.id === studentId);
        toast({
          variant: "destructive",
          title: "Note Invalide",
          description: `La note pour ${student?.name || 'un élève'} ("${gradeStr}") doit être un nombre entre 0 et 20, ou vide.`,
          action: <AlertTriangle className="text-red-500" />,
        });
        break; 
      }
    }

    if (!allGradesValid) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

    Object.entries(grades).forEach(([studentId, gradeStr]) => {
      if (gradeStr.trim() !== '') { // Only save non-empty grades
        setStudentGrade(selectedClassId, studentId, selectedSubjectId, parseFloat(gradeStr));
      } else { // If grade is cleared, we might want to remove it from store or handle as 'not graded'
        // For now, setStudentGrade handles NaN by potentially removing it if it existed.
        // If we want to explicitly remove, we'd call a removeStudentGrade function.
        setStudentGrade(selectedClassId, studentId, selectedSubjectId, NaN); // Or handle removal
      }
    });
    
    setIsLoading(false);

    const currentSubjectName = allSubjects.find(s => s.id === selectedSubjectId)?.name;
    const currentClassName = currentClass?.name;

    toast({
      title: "Notes Enregistrées !",
      description: `Les notes pour ${currentSubjectName} en ${currentClassName} ont été mises à jour.`,
      action: <CheckCircle className="text-green-500" />,
    });
  };
  
  if (allClasses.length === 0) {
    return (
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center">
            <ClipboardEdit className="mr-2 h-6 w-6" /> Saisie des Notes par Classe
          </CardTitle>
        </CardHeader>
        <CardContent>
           <p className="mt-4 text-muted-foreground">Aucune classe disponible. Veuillez en ajouter via le système.</p>
        </CardContent>
      </Card>
    );
  }
  
  if (allSubjects.length === 0) {
     return (
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center">
            <ClipboardEdit className="mr-2 h-6 w-6" /> Saisie des Notes par Classe
          </CardTitle>
        </CardHeader>
        <CardContent>
           <p className="mt-4 text-muted-foreground">Aucune matière disponible. Veuillez en ajouter via le système.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg rounded-lg">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center">
             <ClipboardEdit className="mr-2 h-6 w-6" /> Saisir les Notes pour une Classe
          </CardTitle>
          <CardDescription>
            Sélectionnez une classe et une matière, puis entrez les notes pour chaque élève.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4 items-end">
            <div>
              <Label htmlFor="class-select" className="mb-2 block font-medium flex items-center">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" /> Classe
              </Label>
              <Select 
                onValueChange={(value) => {
                  setSelectedClassId(value);
                  setGrades({}); // Reset grades when class changes
                }} 
                value={selectedClassId} 
                disabled={isLoading || allClasses.length === 0}
              >
                <SelectTrigger id="class-select" className="w-full">
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

            <div>
              <Label htmlFor="subject-select" className="mb-2 block font-medium flex items-center">
                <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" /> Matière
              </Label>
              <Select 
                onValueChange={(value) => {
                  setSelectedSubjectId(value);
                  setGrades({}); // Reset grades when subject changes
                }} 
                value={selectedSubjectId} 
                disabled={isLoading || allSubjects.length === 0}
              >
                <SelectTrigger id="subject-select" className="w-full">
                  <SelectValue placeholder="Sélectionnez une matière" />
                </SelectTrigger>
                <SelectContent>
                  {allSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {selectedClassId && selectedSubjectId && studentsInSelectedClass.length > 0 && (
            <div className="overflow-x-auto rounded-md border mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Nom de l'Élève</TableHead>
                    <TableHead className="font-semibold text-right w-[150px]">Note (/20)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentsInSelectedClass.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="py-3">{student.name}</TableCell>
                      <TableCell className="py-3 text-right">
                        <Input
                          type="number"
                          placeholder="Ex: 15.5"
                          value={grades[student.id] || ''}
                          onChange={(e) => handleGradeChange(student.id, e.target.value)}
                          disabled={isLoading}
                          min="0"
                          max="20"
                          step="0.1"
                          className="max-w-[100px] ml-auto text-right"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {selectedClassId && selectedSubjectId && studentsInSelectedClass.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              Aucun élève dans la classe sélectionnée.
            </p>
          )}

        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            disabled={isLoading || !selectedClassId || !selectedSubjectId || studentsInSelectedClass.length === 0} 
            className="w-full md:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer les Notes
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
