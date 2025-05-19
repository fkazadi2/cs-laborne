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
    name: 'Class A - Grade 10',
    students: [
      { id: 's1', name: 'Aisha Diallo', attendance: 'not_set' },
      { id: 's2', name: 'Kwame Nkosi', attendance: 'not_set' },
      { id: 's3', name: 'Fatoumata Traoré', attendance: 'not_set' },
      { id: 's4', name: 'Moussa Diop', attendance: 'not_set' },
      { id: 's5', name: 'Chinedu Eze', attendance: 'not_set' },
    ],
  },
  {
    id: 'class_b',
    name: 'Class B - Grade 11',
    students: [
      { id: 's6', name: 'Zola Adebayo', attendance: 'not_set' },
      { id: 's7', name: 'Thabo Molefe', attendance: 'not_set' },
      { id: 's8', name: 'Imani Okoro', attendance: 'not_set' },
      { id: 's9', name: 'Jean-Luc Dubois', attendance: 'not_set' },
    ],
  },
  {
    id: 'class_c',
    name: 'Class C - Grade 12',
    students: [
      { id: 's10', name: 'Mariam Kone', attendance: 'not_set' },
      { id: 's11', name: 'David Kante', attendance: 'not_set' },
      { id: 's12', name: 'Nia Adekunle', attendance: 'not_set' },
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
      // In a real app, you'd fetch attendance for selectedClassId and selectedDate
      // For now, just reset students from mock data for the selected class
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
        title: "Missing Information",
        description: "Please select a class and a date.",
        action: <AlertTriangle className="text-red-500" />,
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);

    console.log('Attendance Data:', {
      classId: selectedClassId,
      date: selectedDate,
      attendance: students,
    });

    toast({
      title: "Attendance Saved!",
      description: `Attendance for ${currentClass?.name} on ${selectedDate.toLocaleDateString()} has been recorded.`,
      action: <CheckCircle className="text-green-500" />,
    });
  };

  if (!currentClass) {
     // This handles the initial render case if MOCK_CLASSES[0] is undefined (e.g. empty MOCK_CLASSES)
     // or if selectedClassId somehow becomes invalid.
    return (
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Attendance Input</CardTitle>
          <CardDescription>Select a class to begin.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedClassId} defaultValue={selectedClassId}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_CLASSES.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {MOCK_CLASSES.length === 0 && <p className="mt-4 text-muted-foreground">No classes available.</p>}
        </CardContent>
      </Card>
    );
  }


  return (
    <Card className="shadow-lg rounded-lg">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Record Attendance</CardTitle>
          <CardDescription>
            Select a class and date, then mark attendance for each student.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4 items-end">
            <div>
              <Label htmlFor="class-select" className="mb-2 block font-medium">Class</Label>
              <Select onValueChange={setSelectedClassId} defaultValue={selectedClassId} disabled={isLoading}>
                <SelectTrigger id="class-select" className="w-full">
                  <SelectValue placeholder="Select a class" />
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
                    <TableHead className="font-semibold">Student Name</TableHead>
                    <TableHead className="font-semibold text-center w-[350px]">Status</TableHead>
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
                            <Label htmlFor={`${student.id}-present`} className="cursor-pointer">Present</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="absent" id={`${student.id}-absent`} />
                            <Label htmlFor={`${student.id}-absent`} className="cursor-pointer">Absent</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="late" id={`${student.id}-late`} />
                            <Label htmlFor={`${student.id}-late`} className="cursor-pointer">Late</Label>
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
              No students found for this class, or class not selected.
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading || students.length === 0} className="w-full md:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Attendance
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
