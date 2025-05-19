
// src/components/grades-form.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle, Loader2, Save, ClipboardList } from 'lucide-react';
import { getClasses, getSubjects, subscribe, type ClassData, type Subject as StoreSubject, type Student as StoreStudent } from '@/lib/school-data-store';

// Student type for this form, can be simpler if grade-specific details are not needed yet
interface StudentForGrades extends Pick<StoreStudent, 'id' | 'name'> {}
interface ClassDataForGrades extends Omit<ClassData, 'students'> {
  students: StudentForGrades[];
}

export function GradesForm() {
  const [allClasses, setAllClasses] = useState<ClassDataForGrades[]>(getClasses().map(c => ({...c, students: c.students.map(s => ({id: s.id, name: s.name}))})));
  const [allSubjects, setAllSubjects] = useState<StoreSubject[]>(getSubjects());

  const [selectedClassId, setSelectedClassId] = useState<string | undefined>(allClasses[0]?.id);
  const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | undefined>(allSubjects[0]?.id);
  const [grade, setGrade] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      const updatedClassesFromStore = getClasses();
      const updatedClassesForGrades = updatedClassesFromStore.map(c => ({
        ...c,
        students: c.students.map(s => ({id: s.id, name: s.name})) // Map to simplified student structure
      }));
      setAllClasses(updatedClassesForGrades);

      const currentSelectedClassStillExists = updatedClassesForGrades.find(c => c.id === selectedClassId);
      if (!currentSelectedClassStillExists && updatedClassesForGrades.length > 0) {
        setSelectedClassId(updatedClassesForGrades[0].id);
        setSelectedStudentId(undefined); // Reset student as class changed
      } else if (!currentSelectedClassStillExists && updatedClassesForGrades.length === 0) {
        setSelectedClassId(undefined);
        setSelectedStudentId(undefined);
      } else if (currentSelectedClassStillExists && selectedStudentId && !currentSelectedClassStillExists.students.find(s => s.id === selectedStudentId)) {
        // If current student is no longer in the (potentially updated) selected class
        setSelectedStudentId(undefined);
      }
    });
    return () => unsubscribe();
  }, [selectedClassId, selectedStudentId]);


  const currentClass = useMemo(() => allClasses.find(c => c.id === selectedClassId), [selectedClassId, allClasses]);
  const currentStudents = useMemo(() => currentClass?.students || [], [currentClass]);

  useEffect(() => {
    // Auto-select first student if class changes or currentStudents list updates and no student is selected
    if (currentStudents.length > 0 && !selectedStudentId) {
        setSelectedStudentId(currentStudents[0].id);
    } else if (currentStudents.length === 0) {
        setSelectedStudentId(undefined); // No students in class, so no student selected
    }
  }, [currentStudents, selectedStudentId, selectedClassId]);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedClassId || !selectedStudentId || !selectedSubjectId || grade.trim() === '') {
      toast({
        variant: "destructive",
        title: "Informations Manquantes",
        description: "Veuillez sélectionner une classe, un élève, une matière et saisir une note.",
        action: <AlertTriangle className="text-red-500" />,
      });
      return;
    }

    const numericGrade = parseFloat(grade);
    if (isNaN(numericGrade) || numericGrade < 0 || numericGrade > 20) {
         toast({
            variant: "destructive",
            title: "Note Invalide",
            description: "La note doit être un nombre entre 0 et 20.",
            action: <AlertTriangle className="text-red-500" />,
        });
        return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);

    console.log('Données de note enregistrées :', {
      classId: selectedClassId,
      studentId: selectedStudentId,
      subjectId: selectedSubjectId,
      grade: numericGrade,
    });

    const studentName = currentStudents.find(s => s.id === selectedStudentId)?.name;
    const subjectName = allSubjects.find(s => s.id === selectedSubjectId)?.name;

    toast({
      title: "Note Enregistrée !",
      description: `La note pour ${studentName} en ${subjectName} a été enregistrée : ${numericGrade}/20.`,
      action: <CheckCircle className="text-green-500" />,
    });
    setGrade(''); 
  };
  
  if (allClasses.length === 0) {
    return (
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center">
            <ClipboardList className="mr-2 h-6 w-6" /> Saisie des Notes
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
            <ClipboardList className="mr-2 h-6 w-6" /> Saisie des Notes
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
             <ClipboardList className="mr-2 h-6 w-6" /> Saisir une Note
          </CardTitle>
          <CardDescription>
            Sélectionnez la classe, l'élève, la matière et entrez la note.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="class-select" className="mb-2 block font-medium">Classe</Label>
              <Select 
                onValueChange={(value) => {
                  setSelectedClassId(value);
                  setSelectedStudentId(undefined); 
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
              <Label htmlFor="student-select" className="mb-2 block font-medium">Élève</Label>
              <Select 
                onValueChange={setSelectedStudentId} 
                value={selectedStudentId} 
                disabled={isLoading || currentStudents.length === 0}
              >
                <SelectTrigger id="student-select" className="w-full">
                  <SelectValue placeholder={currentStudents.length === 0 ? "Aucun élève dans la classe" : "Sélectionnez un élève"} />
                </SelectTrigger>
                <SelectContent>
                  {currentStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subject-select" className="mb-2 block font-medium">Matière</Label>
              <Select onValueChange={setSelectedSubjectId} value={selectedSubjectId} disabled={isLoading || allSubjects.length === 0}>
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
          
          <div>
            <Label htmlFor="grade-input" className="mb-2 block font-medium">Note (sur 20)</Label>
            <Input
              id="grade-input"
              type="number"
              placeholder="Ex: 15.5"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              disabled={isLoading}
              min="0"
              max="20"
              step="0.1"
            />
          </div>

        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading || !selectedStudentId || !selectedSubjectId} className="w-full md:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer la Note
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
