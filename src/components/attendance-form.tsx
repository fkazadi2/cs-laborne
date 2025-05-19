
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
import { AlertTriangle, CheckCircle, Loader2, Save, ListChecks, Users, CalendarDays, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getClasses, subscribe, type ClassData, type Student as StoreStudent } from '@/lib/school-data-store';

// Adjusted Student type for this component's specific needs if different from store, or use store's directly
interface Student extends StoreStudent {
  // attendance is already in StoreStudent, ensure it's 'not_set' by default for new form instances
}

interface RecordedAttendance {
  id: string;
  classInfo: { id: string; name: string };
  date: Date;
  students: Student[];
  submissionTime: Date;
}

export function AttendanceForm() {
  const [allClasses, setAllClasses] = useState<ClassData[]>(getClasses());
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>(allClasses[0]?.id);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [studentsForForm, setStudentsForForm] = useState<Student[]>([]); // Renamed to avoid confusion with store's students
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recordedAttendances, setRecordedAttendances] = useState<RecordedAttendance[]>([]);
  const { toast } = useToast();

  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [filterClassId, setFilterClassId] = useState<string | undefined>(undefined);
  const [maxCalendarDate, setMaxCalendarDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      const updatedClasses = getClasses();
      setAllClasses(updatedClasses);
      // If the currently selected class still exists, refresh its student list
      // Otherwise, reset selection or select the first available class
      const currentSelectedClassStillExists = updatedClasses.find(c => c.id === selectedClassId);
      if (!currentSelectedClassStillExists && updatedClasses.length > 0) {
        setSelectedClassId(updatedClasses[0].id);
      } else if (!currentSelectedClassStillExists && updatedClasses.length === 0) {
        setSelectedClassId(undefined);
      }
      // This will trigger the other useEffect that depends on selectedClassId or allClasses
    });
    return () => unsubscribe();
  }, [selectedClassId]); // Add selectedClassId to re-evaluate if it needs to change

  const currentClass = useMemo(() => allClasses.find(c => c.id === selectedClassId), [selectedClassId, allClasses]);

  useEffect(() => {
    const today = new Date();
    if (!selectedDate) { // Only set initial date once
        setSelectedDate(today);
    }
    if (!filterDate) {
        setFilterDate(today);
    }
    setMaxCalendarDate(today);
  }, [selectedDate, filterDate]);


  useEffect(() => {
    if (currentClass) {
      // Ensure attendance is initialized to 'not_set' for the form
      setStudentsForForm(currentClass.students.map(s => ({ ...s, attendance: s.attendance || 'not_set' })));
    } else {
      setStudentsForForm([]);
    }
  }, [selectedClassId, currentClass, allClasses]); // Add allClasses to dependencies

  const handleAttendanceChange = (studentId: string, value: Student['attendance']) => {
    setStudentsForForm((prevStudents) =>
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
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newRecord: RecordedAttendance = {
      id: `rec_${Date.now()}`,
      classInfo: { id: currentClass.id, name: currentClass.name },
      date: selectedDate,
      students: JSON.parse(JSON.stringify(studentsForForm)), 
      submissionTime: new Date(),
    };
    console.log("Données de présence enregistrées localement:", newRecord);

    setRecordedAttendances(prevRecords => [newRecord, ...prevRecords.slice(0, 4)]);
    setIsLoading(false);

    toast({
      title: "Présences Enregistrées !",
      description: `Les présences pour ${currentClass?.name} le ${selectedDate.toLocaleDateString('fr-FR')} ont été enregistrées.`,
      action: <CheckCircle className="text-green-500" />,
    });
  };

  const getAttendanceBadgeVariant = (status: Student['attendance']) => {
    switch (status) {
      case 'present': return 'default'; 
      case 'absent': return 'destructive';
      case 'late': return 'secondary'; 
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

  const filteredAttendances = useMemo(() => {
    return recordedAttendances.filter(record => {
      const dateMatch = filterDate ? isSameDay(record.date, filterDate) : true;
      const classMatch = filterClassId ? record.classInfo.id === filterClassId : true;
      return dateMatch && classMatch;
    });
  }, [recordedAttendances, filterDate, filterClassId]);


  if (allClasses.length === 0) {
    return (
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Saisie des Présences</CardTitle>
        </CardHeader>
        <CardContent>
           <p className="mt-4 text-muted-foreground">Aucune classe disponible pour le moment. Veuillez en créer ou en ajouter.</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!currentClass && allClasses.length > 0 && !selectedClassId) {
      // If no class is selected yet, but classes are available, prompt selection or default to first.
      // This effect ensures a class is selected if available.
      if (allClasses.length > 0 && !selectedClassId) {
          setSelectedClassId(allClasses[0].id); 
      }
    return (
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Saisie des Présences</CardTitle>
          <CardDescription>Chargement des classes...</CardDescription>
        </CardHeader>
        <CardContent>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
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
                <Select 
                  onValueChange={setSelectedClassId} 
                  value={selectedClassId || ''} 
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
                <Label htmlFor="date-picker" className="mb-2 block font-medium">Date</Label>
                <DatePicker 
                  date={selectedDate} 
                  setDate={setSelectedDate} 
                  buttonProps={{id:"date-picker", disabled:isLoading || !selectedDate}}
                  calendarProps={{ disabled: (date) => maxCalendarDate ? date > maxCalendarDate : false }}
                />
              </div>
            </div>

            {studentsForForm.length > 0 && selectedDate ? (
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Nom de l'Élève</TableHead>
                      <TableHead className="font-semibold text-center w-[350px]">Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentsForForm.map((student) => (
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
                { !selectedDate ? "Chargement de la date..." : (currentClass && currentClass.students.length === 0 ? "Aucun élève dans cette classe." : "Sélectionnez une classe pour voir les élèves.")}
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading || studentsForForm.length === 0 || !selectedDate} className="w-full md:w-auto">
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
              Filtrez et visualisez les 5 derniers enregistrements de cette session.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 items-end p-4 border rounded-md bg-muted/50">
                    <div>
                        <Label htmlFor="filter-date-picker" className="mb-2 block font-medium text-sm">Filtrer par Date</Label>
                         <DatePicker 
                            date={filterDate} 
                            setDate={(date) => setFilterDate(date)} 
                            placeholder="Toutes les dates"
                            buttonProps={{id:"filter-date-picker", variant: "outline"}}
                            calendarProps={{ disabled: (date) => maxCalendarDate ? date > maxCalendarDate : false }}
                         />
                    </div>
                    <div>
                        <Label htmlFor="filter-class-select" className="mb-2 block font-medium text-sm">Filtrer par Classe</Label>
                        <Select onValueChange={(value) => setFilterClassId(value === "all" ? undefined : value)} value={filterClassId || "all"}>
                            <SelectTrigger id="filter-class-select" className="w-full">
                                <SelectValue placeholder="Toutes les classes" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les classes</SelectItem>
                                {allClasses.map((cls) => (
                                <SelectItem key={cls.id} value={cls.id}>
                                    {cls.name}
                                </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {filteredAttendances.length > 0 ? (
                    <div className="space-y-6">
                    {filteredAttendances.map((record) => (
                        <div key={record.id} className="border p-4 rounded-md shadow-sm">
                        <div className="flex flex-wrap justify-between items-start mb-3">
                            <div className="mb-2 sm:mb-0">
                            <div className="flex items-center text-lg font-semibold text-foreground">
                                <Users className="mr-2 h-5 w-5 text-primary" />
                                {record.classInfo.name}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <CalendarDays className="mr-2 h-4 w-4" />
                                {format(record.date, "PPP", { locale: fr })}
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
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <Filter className="mx-auto h-12 w-12 mb-4 text-gray-400" />
                        <p className="text-lg">Aucun enregistrement de présence trouvé.</p>
                        <p className="text-sm">Essayez d'ajuster vos filtres ou enregistrez de nouvelles données de présence.</p>
                    </div>
                )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
