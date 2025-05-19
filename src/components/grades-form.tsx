
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

interface Student {
  id: string;
  name: string;
}

interface ClassData {
  id: string;
  name: string;
  students: Student[];
}

interface Subject {
  id: string;
  name: string;
}

const MOCK_CLASSES: ClassData[] = [
  {
    id: 'class_a',
    name: 'Classe A - 10ème Année',
    students: [
      { id: 's1', name: 'Léa Dubois' },
      { id: 's2', name: 'Lucas Martin' },
    ],
  },
  {
    id: 'class_b',
    name: 'Classe B - 11ème Année',
    students: [
      { id: 's6', name: 'Emma Durand' },
      { id: 's7', name: 'Gabriel Leroy' },
    ],
  },
];

const MOCK_SUBJECTS: Subject[] = [
  { id: 'math', name: 'Mathématiques' },
  { id: 'french', name: 'Français' },
  { id: 'science', name: 'Sciences' },
  { id: 'history', name: 'Histoire' },
];

export function GradesForm() {
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>(MOCK_CLASSES[0]?.id);
  const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | undefined>(MOCK_SUBJECTS[0]?.id);
  const [grade, setGrade] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const currentClass = useMemo(() => MOCK_CLASSES.find(c => c.id === selectedClassId), [selectedClassId]);
  const currentStudents = useMemo(() => currentClass?.students || [], [currentClass]);

  useEffect(() => {
    // Reset student selection if class changes and student is no longer in the new class
    if (currentClass && selectedStudentId && !currentClass.students.find(s => s.id === selectedStudentId)) {
      setSelectedStudentId(undefined);
    }
    // Set default student if class changes and no student is selected
    else if (currentClass && !selectedStudentId && currentClass.students.length > 0) {
       setSelectedStudentId(currentClass.students[0].id);
    }
  }, [selectedClassId, currentClass, selectedStudentId]);

  useEffect(() => {
    if (currentStudents.length > 0 && !selectedStudentId) {
        setSelectedStudentId(currentStudents[0].id);
    }
  }, [currentStudents, selectedStudentId]);


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

    // Basic grade validation (example: must be a number between 0 and 20)
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
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    setIsLoading(false);

    console.log('Données de note enregistrées :', {
      classId: selectedClassId,
      studentId: selectedStudentId,
      subjectId: selectedSubjectId,
      grade: numericGrade,
    });

    const studentName = currentStudents.find(s => s.id === selectedStudentId)?.name;
    const subjectName = MOCK_SUBJECTS.find(s => s.id === selectedSubjectId)?.name;

    toast({
      title: "Note Enregistrée !",
      description: `La note pour ${studentName} en ${subjectName} a été enregistrée : ${numericGrade}/20.`,
      action: <CheckCircle className="text-green-500" />,
    });
    setGrade(''); // Clear grade input
  };
  
  if (MOCK_CLASSES.length === 0) {
    return (
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center">
            <ClipboardList className="mr-2 h-6 w-6" /> Saisie des Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
           <p className="mt-4 text-muted-foreground">Aucune classe disponible pour le moment.</p>
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
                  setSelectedStudentId(undefined); // Reset student when class changes
                }} 
                value={selectedClassId} 
                disabled={isLoading}
              >
                <SelectTrigger id="class-select" className="w-full">
                  <SelectValue placeholder="Sélectionnez une classe" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_CLASSES.map((cls) => (
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
                  <SelectValue placeholder={currentStudents.length === 0 ? "Aucun élève" : "Sélectionnez un élève"} />
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
              <Select onValueChange={setSelectedSubjectId} value={selectedSubjectId} disabled={isLoading}>
                <SelectTrigger id="subject-select" className="w-full">
                  <SelectValue placeholder="Sélectionnez une matière" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_SUBJECTS.map((subject) => (
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
          <Button type="submit" disabled={isLoading || !selectedStudentId} className="w-full md:w-auto">
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
