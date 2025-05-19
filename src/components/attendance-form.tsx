
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
import { AlertTriangle, CheckCircle, Loader2, Save, ListChecks, Users, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

interface RecordedAttendance {
  id: string;
  classInfo: { id: string; name: string };
  date: Date;
  students: Student[];
  submissionTime: Date;
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
  const [recordedAttendances, setRecordedAttendances] = useState<RecordedAttendance[]>([]);
  const { toast } = useToast();

  const currentClass = useMemo(() => MOCK_CLASSES.find(c => c.id === selectedClassId), [selectedClassId]);

  useEffect(() => {
    if (currentClass) {
      // Reset student attendance to 'not_set' when class or date changes
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
    if (!selectedClassId || !selectedDate || !currentClass) {
      toast({
        variant: "destructive",
        title: "Informations Manquantes",
        description: "Veuillez sélectionner une classe et une date.",
        action: <AlertTriangle className="text-red-500" />,
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Shorter delay

    const newRecord: RecordedAttendance = {
      id: `rec_${Date.now()}`, // Simple unique ID
      classInfo: { id: currentClass.id, name: currentClass.name },
      date: selectedDate,
      students: JSON.parse(JSON.stringify(students)), // Deep copy
      submissionTime: new Date(),
    };

    setRecordedAttendances(prevRecords => [newRecord, ...prevRecords.slice(0, 4)]); // Keep last 5 records

    setIsLoading(false);

    console.log('Données de présence enregistrées localement:', newRecord);

    toast({
      title: "Présences Enregistrées !",
      description: `Les présences pour ${currentClass?.name} le ${selectedDate.toLocaleDateString('fr-FR')} ont été enregistrées.`,
      action: <CheckCircle className="text-green-500" />,
    });
    
    // Optionally reset form fields or student states here if needed
    // For now, we keep student states as they might want to make quick adjustments
  };

  const getAttendanceBadgeVariant = (status: Student['attendance']) => {
    switch (status) {
      case 'present': return 'default'; // Or a custom green-like variant if defined
      case 'absent': return 'destructive';
      case 'late': return 'secondary'; // Or a custom yellow-like variant
      default: return 'outline';
    }
  };
  
  const getAttendanceStatusFrench = (status: Student['attendance']) => {
    switch (status) {
      case 'present': return 'Présent(e)';
      case 'absent': return 'Absent(e)';
      case 'late': return 'En Retard';
      default: return 'Non Défini';
    }
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
    <>
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
                <Select onValueChange={setSelectedClassId} value={selectedClassId || ''} disabled={isLoading}>
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
                            value={student.attendance}
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

      {recordedAttendances.length > 0 && (
        <Card className="mt-8 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center">
              <ListChecks className="mr-2 h-6 w-6" />
              Historique Récent des Saisies de Présence
            </CardTitle>
            <CardDescription>
              Les 5 derniers enregistrements de cette session. Ces données ne sont pas stockées de façon permanente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recordedAttendances.map((record) => (
                <div key={record.id} className="border p-4 rounded-md shadow-sm">
                  <div className="flex flex-wrap justify-between items-start mb-3">
                    <div className="mb-2 sm:mb-0">
                      <div className="flex items-center text-lg font-semibold text-foreground">
                        <Users className="mr-2 h-5 w-5 text-primary" />
                        {record.classInfo.name}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {record.date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground self-start sm:self-center">
                      Saisi le: {record.submissionTime.toLocaleTimeString('fr-FR')}
                    </p>
                  </div>
                  
                  <div className="overflow-x-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-medium">Élève</TableHead>
                          <TableHead className="font-medium text-right">Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {record.students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>{student.name}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant={getAttendanceBadgeVariant(student.attendance)}>
                                {getAttendanceStatusFrench(student.attendance)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

    