
// src/components/report-card-generator.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, Users, Loader2, FileText, GraduationCap, CalendarDays, CheckCircle } from 'lucide-react';
import { 
  getClasses, 
  subscribe, 
  getStudentGradesForClass,
  type ClassData, 
  type Student as StoreStudent,
  type Subject as StoreSubject
} from '@/lib/school-data-store';

interface PreviewData {
  student: StoreStudent;
  classInfo: ClassData;
  grades: { subject: StoreSubject; grade?: number }[];
  average: number | undefined;
}

export function ReportCardGenerator() {
  const [allClasses, setAllClasses] = useState<ClassData[]>(getClasses());
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>(allClasses[0]?.id);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [currentSchoolYear, setCurrentSchoolYear] = useState<string>("");

  useEffect(() => {
    const year = new Date().getFullYear();
    setCurrentSchoolYear(`${year -1}-${year}`);
  }, [])

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
      // Also refresh preview data if the selected student/class details change due to store update
      if (previewData && selectedClassId) {
        const studentInUpdatedClass = updatedClasses.find(c => c.id === selectedClassId)?.students.find(s => s.id === previewData.student.id);
        if (studentInUpdatedClass && currentClass) {
           handlePreviewReportCard(studentInUpdatedClass, currentClass);
        } else {
            setIsPreviewOpen(false); // Close preview if student/class no longer valid
        }
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [selectedClassId, previewData]);

  const currentClass = useMemo(() => allClasses.find(c => c.id === selectedClassId), [selectedClassId, allClasses]);
  const studentsInSelectedClass: StoreStudent[] = useMemo(() => {
    return currentClass?.students || [];
  }, [currentClass]);

  const handlePreviewReportCard = (studentToPreview: StoreStudent, classData: ClassData) => {
    if (!classData) return;

    const studentGrades = getStudentGradesForClass(studentToPreview.id, classData.id);
    const validGrades = studentGrades.filter(sg => typeof sg.grade === 'number').map(sg => sg.grade as number);
    const average = validGrades.length > 0 ? validGrades.reduce((sum, g) => sum + g, 0) / validGrades.length : undefined;

    setPreviewData({
      student: studentToPreview,
      classInfo: classData,
      grades: studentGrades,
      average: average,
    });
    setIsPreviewOpen(true);
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
    <>
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center">
            <FileText className="mr-2 h-6 w-6" /> Préparer les Bulletins Scolaires
          </CardTitle>
          <CardDescription>
            Sélectionnez une classe pour voir la liste des élèves et prévisualiser leurs bulletins.
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
                    <TableHead className="font-semibold text-right w-[200px]">Action</TableHead>
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
                          onClick={() => currentClass && handlePreviewReportCard(student, currentClass)}
                          disabled={isLoading}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Prévisualiser Bulletin
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

      {previewData && (
        <AlertDialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center text-2xl font-bold text-primary flex items-center justify-center">
                <GraduationCap className="mr-3 h-8 w-8" />
                BULLETIN SCOLAIRE (Simulation)
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center text-sm">
                Ceci est un aperçu simulé du bulletin. La génération PDF réelle sera implémentée ultérieurement.
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <ScrollArea className="h-[60vh] p-1">
              <div className="space-y-4 p-4 border rounded-md">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold">C.S. La Borne</h2>
                  <p className="text-muted-foreground">Votre partenaire pour l'excellence éducative</p>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm border-b pb-4 mb-4">
                  <div><strong>Nom de l'Élève:</strong> {previewData.student.name}</div>
                  <div><strong>Classe:</strong> {previewData.classInfo.name}</div>
                  <div><strong>Année Scolaire:</strong> {currentSchoolYear}</div>
                   <div><strong>Date d'Émission:</strong> {new Date().toLocaleDateString('fr-FR')}</div>
                </div>

                <h3 className="text-lg font-semibold text-primary mb-2">Résultats Scolaires</h3>
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-semibold">Matière</TableHead>
                        <TableHead className="font-semibold text-center w-[100px]">Note (/20)</TableHead>
                        <TableHead className="font-semibold text-center">Appréciation Enseignant</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.grades.map(({ subject, grade }) => (
                        <TableRow key={subject.id}>
                          <TableCell>{subject.name}</TableCell>
                          <TableCell className="text-center">
                            {grade !== undefined ? grade.toFixed(1) : <span className="text-muted-foreground">-</span>}
                          </TableCell>
                           <TableCell className="text-center text-muted-foreground text-xs italic">
                            (Appréciation à ajouter)
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-lg font-semibold">
                    Moyenne Générale: 
                    <span className={`ml-2 ${previewData.average !== undefined && previewData.average < 10 ? 'text-destructive' : 'text-green-600'}`}>
                       {previewData.average !== undefined ? previewData.average.toFixed(2) + " /20" : 'N/A'}
                    </span>
                  </p>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-md mb-1">Appréciation Générale du Conseil de Classe:</h4>
                  <p className="text-sm text-muted-foreground italic p-3 border rounded-md bg-muted/50">
                    {previewData.average !== undefined ? (
                        previewData.average >= 15 ? "Excellent travail ! L'élève a démontré une maîtrise exceptionnelle des matières. Continuez ainsi !" :
                        previewData.average >= 12 ? "Bon travail. L'élève progresse bien et montre un engagement sérieux." :
                        previewData.average >= 10 ? "Passable. L'élève a atteint le niveau requis, mais des efforts supplémentaires sont encouragés." :
                        "Insuffisant. L'élève doit intensifier ses efforts pour améliorer ses résultats."
                    ) : "Aucune appréciation disponible car les notes ne sont pas complètes."}
                  </p>
                </div>

                <div className="mt-8 text-xs text-muted-foreground text-center">
                    Cachet de l'école et Signature du Directeur (simulés)
                </div>
              </div>
            </ScrollArea>
            
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel>Fermer</AlertDialogCancel>
              {/* <AlertDialogAction onClick={() => alert("PDF Généré (simulation)")}>Télécharger PDF (Simulation)</AlertDialogAction> */}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}

