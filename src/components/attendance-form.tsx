
// src/components/attendance-form.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle, Loader2, Save } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  attendance: 'present' | 'absent' | 'late' | 'not_set';
}

interface ClassData {
  id: string;
  name: string;
  students: Student[];
}

const MOCK_CLASSES: ClassData[] = [
  {
    id: 'class_a',
    name: 'Classe A - 10ème Année',
    students: [
      { id: 's1', name: 'Léa Dubois', attendance: 'not_set' },
      { id: 's2', name: 'Lucas Martin', attendance: 'not_set' },
      { id: 's3', name: 'Chloé Bernard', attendance: 'not_set' },
      { id: 's4', name: 'Hugo Moreau', attendance: 'not_set' },
      { id: 's5', name: 'Manon Petit', attendance: 'not_set' },
    ],
  },
  {
    id: 'class_b',
    name: 'Classe B - 11ème Année',
    students: [
      { id: 's6', name: 'Emma Durand', attendance: 'not_set' },
      { id: 's7', name: 'Gabriel Leroy', attendance: 'not_set' },
      { id: 's8', name: 'Alice Lefevre', attendance: 'not_set' },
      { id: 's9', name: 'Adam Roux', attendance: 'not_set' },
    ],
  },
  {
    id: 'class_c',
    name: 'Classe C - 12ème Année',
    students: [
      { id: 's10', name: 'Camille Girard', attendance: 'not_set' },
      { id: 's11', name: 'Jules Lambert', attendance: 'not_set' },
      { id: 's12', name: 'Inès Bonnet', attendance: 'not_set' },
    ],
  }
];

export function AttendanceForm() {
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>(MOCK_CLASSES[0]?.id);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const currentClass = useMemo(() => MOCK_CLASSES.find(c => c.id === selectedClassId), [selectedClassId]);

  useEffect(() => {
    if (currentClass) {
      setStudents(currentClass.students.map(s => ({ ...s, attendance: 'not_set' })));
    } else {
      setStudents([]);
    }
  }, [selectedClassId, selectedDate, currentClass]);


  const handleAttendanceChange = (studentId: string, value: Student['attendance']) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId ? { ...student, attendance: value } : student
      )
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedClassId || !selectedDate) {
      toast({
        variant: "destructive",
        title: "Informations Manquantes",
        description: "Veuillez sélectionner une classe et une date.",
        action: <AlertTriangle className="text-red-500" />,
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);

    console.log('Données de présence :', {
      classId: selectedClassId,
      date: selectedDate,
      attendance: students,
    });

    toast({
      title: "Présences Enregistrées !",
      description: `Les présences pour ${currentClass?.name} le ${selectedDate.toLocaleDateString('fr-FR')} ont été enregistrées.`,
      action: <CheckCircle className="text-green-500" />,
    });
  };

  if (!currentClass && MOCK_CLASSES.length > 0) {
    // This handles the initial render case if MOCK_CLASSES[0] is undefined (e.g. empty MOCK_CLASSES)
    // or if selectedClassId somehow becomes invalid.
    return (
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Saisie des Présences</CardTitle>
          <CardDescription>Sélectionnez une classe pour commencer.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedClassId} defaultValue={selectedClassId}>
            <SelectTrigger className="w-full md:w-[300px]">
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
          {MOCK_CLASSES.length === 0 && <p className="mt-4 text-muted-foreground">Aucune classe disponible.</p>}
        </CardContent>
      </Card>
    );
  }
  
  if (MOCK_CLASSES.length === 0) {
    return (
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Saisie des Présences</CardTitle>
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
          <CardTitle className="text-2xl text-primary">Enregistrer les Présences</CardTitle>
          <CardDescription>
            Sélectionnez une classe et une date, puis marquez la présence de chaque élève.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4 items-end">
            <div>
              <Label htmlFor="class-select" className="mb-2 block font-medium">Classe</Label>
              <Select onValueChange={setSelectedClassId} defaultValue={selectedClassId} disabled={isLoading}>
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
              <Label htmlFor="date-picker" className="mb-2 block font-medium">Date</Label>
              <DatePicker date={selectedDate} setDate={setSelectedDate} buttonProps={{id:"date-picker", disabled:isLoading}}/>
            </div>
          </div>

          {students.length > 0 ? (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Nom de l'Élève</TableHead>
                    <TableHead className="font-semibold text-center w-[350px]">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="py-3">{student.name}</TableCell>
                      <TableCell className="py-3 text-center">
                        <RadioGroup
                          defaultValue={student.attendance}
                          onValueChange={(value) => handleAttendanceChange(student.id, value as Student['attendance'])}
                          className="flex justify-center space-x-2 sm:space-x-4"
                          disabled={isLoading}
                        >
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="present" id={`${student.id}-present`} />
                            <Label htmlFor={`${student.id}-present`} className="cursor-pointer">Présent(e)</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="absent" id={`${student.id}-absent`} />
                            <Label htmlFor={`${student.id}-absent`} className="cursor-pointer">Absent(e)</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="late" id={`${student.id}-late`} />
                            <Label htmlFor={`${student.id}-late`} className="cursor-pointer">En Retard</Label>
                          </div>
                        </RadioGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Aucun élève trouvé pour cette classe, ou classe non sélectionnée.
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading || students.length === 0} className="w-full md:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer les Présences
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
