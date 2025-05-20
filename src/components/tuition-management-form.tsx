
// src/components/tuition-management-form.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle, Loader2, Banknote, Users, Receipt, Landmark, History } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  getClasses,
  subscribe,
  getTuitionFeeForClass,
  recordPayment,
  getPaymentsForStudent,
  getOutstandingBalanceForStudent,
  type ClassData,
  type Student as StoreStudent,
  type PaymentRecord,
  type TuitionFee
} from '@/lib/school-data-store';

export function TuitionManagementForm() {
  const [allClasses, setAllClasses] = useState<ClassData[]>(getClasses());
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>(allClasses[0]?.id);
  const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>(undefined);
  
  const [currentTuitionFee, setCurrentTuitionFee] = useState<TuitionFee | undefined>(undefined);
  const [studentPayments, setStudentPayments] = useState<PaymentRecord[]>([]);
  const [outstandingBalance, setOutstandingBalance] = useState<{ balance: number; currency: string; feeAmount: number; totalPaid: number } | undefined>(undefined);
  
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      const updatedClasses = getClasses();
      setAllClasses(updatedClasses);
      // Re-fetch data if selected class/student is still valid or needs update
      if (selectedClassId) {
        const classFee = getTuitionFeeForClass(selectedClassId);
        setCurrentTuitionFee(classFee);
        if (selectedStudentId) {
          setStudentPayments(getPaymentsForStudent(selectedStudentId, selectedClassId));
          setOutstandingBalance(getOutstandingBalanceForStudent(selectedStudentId, selectedClassId));
        }
      }
    });
    return () => unsubscribe();
  }, [selectedClassId, selectedStudentId]);

  const currentClass = useMemo(() => allClasses.find(c => c.id === selectedClassId), [selectedClassId, allClasses]);
  const studentsInSelectedClass: StoreStudent[] = useMemo(() => currentClass?.students || [], [currentClass]);

  useEffect(() => {
    if (selectedClassId) {
      const fee = getTuitionFeeForClass(selectedClassId);
      setCurrentTuitionFee(fee);
      // Reset student specific data when class changes
      setSelectedStudentId(undefined);
      setStudentPayments([]);
      setOutstandingBalance(undefined);
      setPaymentAmount("");
    }
  }, [selectedClassId]);

  useEffect(() => {
    if (selectedStudentId && selectedClassId) {
      setStudentPayments(getPaymentsForStudent(selectedStudentId, selectedClassId));
      setOutstandingBalance(getOutstandingBalanceForStudent(selectedStudentId, selectedClassId));
    } else {
      setStudentPayments([]);
      setOutstandingBalance(undefined);
    }
  }, [selectedStudentId, selectedClassId]);


  const handleRecordPayment = async () => {
    if (!selectedStudentId || !selectedClassId || !paymentAmount || isNaN(parseFloat(paymentAmount)) || parseFloat(paymentAmount) <= 0) {
      toast({
        variant: "destructive",
        title: "Informations Invalides",
        description: "Veuillez sélectionner un élève, une classe et entrer un montant de paiement valide.",
        action: <AlertTriangle className="text-red-500" />,
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API call

    recordPayment(selectedStudentId, selectedClassId, parseFloat(paymentAmount), currentTuitionFee?.currency || 'USD');
    
    // Refresh student's payment data
    setStudentPayments(getPaymentsForStudent(selectedStudentId, selectedClassId));
    setOutstandingBalance(getOutstandingBalanceForStudent(selectedStudentId, selectedClassId));
    
    setIsLoading(false);
    setPaymentAmount(""); // Reset payment amount field
    
    const studentName = studentsInSelectedClass.find(s => s.id === selectedStudentId)?.name;
    toast({
      title: "Paiement Enregistré!",
      description: `Le paiement de ${parseFloat(paymentAmount)} ${currentTuitionFee?.currency || 'USD'} pour ${studentName} a été enregistré.`,
      action: <CheckCircle className="text-green-500" />,
    });
  };

  if (allClasses.length === 0) {
    return (
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center">
            <Landmark className="mr-2 h-6 w-6" /> Gestion du Minerval
          </CardTitle>
        </CardHeader>
        <CardContent>
           <p className="mt-4 text-muted-foreground">Aucune classe disponible. Veuillez en ajouter via le système.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center">
          <Landmark className="mr-2 h-6 w-6" /> Enregistrer un Paiement de Minerval
        </CardTitle>
        <CardDescription>
          Sélectionnez une classe et un élève pour enregistrer un paiement et consulter le statut du minerval.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="class-select-minerval" className="mb-2 block font-medium flex items-center">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" /> Classe
            </Label>
            <Select 
              value={selectedClassId} 
              onValueChange={setSelectedClassId}
              disabled={isLoading}
            >
              <SelectTrigger id="class-select-minerval">
                <SelectValue placeholder="Sélectionnez une classe" />
              </SelectTrigger>
              <SelectContent>
                {allClasses.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="student-select-minerval" className="mb-2 block font-medium flex items-center">
              <Receipt className="mr-2 h-4 w-4 text-muted-foreground" /> Élève
            </Label>
            <Select 
              value={selectedStudentId} 
              onValueChange={setSelectedStudentId}
              disabled={isLoading || !selectedClassId || studentsInSelectedClass.length === 0}
            >
              <SelectTrigger id="student-select-minerval">
                <SelectValue placeholder="Sélectionnez un élève" />
              </SelectTrigger>
              <SelectContent>
                {studentsInSelectedClass.map((student) => (
                  <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {currentTuitionFee && (
            <div className="p-4 border rounded-md bg-muted/30">
                <h3 className="text-lg font-semibold text-primary mb-2">Informations sur le Minerval</h3>
                <p><strong>Frais de scolarité pour {currentClass?.name}:</strong> {currentTuitionFee.amount.toLocaleString()} {currentTuitionFee.currency}</p>
                {selectedStudentId && outstandingBalance !== undefined && (
                    <>
                        <p><strong>Total Payé par {studentsInSelectedClass.find(s=>s.id === selectedStudentId)?.name || 'cet élève'}:</strong> {outstandingBalance.totalPaid.toLocaleString()} {outstandingBalance.currency}</p>
                        <p className={`font-bold ${outstandingBalance.balance > 0 ? 'text-destructive' : 'text-green-600'}`}>
                            <strong>Solde Restant:</strong> {outstandingBalance.balance.toLocaleString()} {outstandingBalance.currency}
                        </p>
                    </>
                )}
                 {!selectedStudentId && <p className="text-sm text-muted-foreground mt-1">Sélectionnez un élève pour voir son solde.</p>}
            </div>
        )}

        {selectedStudentId && currentClass && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="payment-amount" className="mb-2 block font-medium flex items-center">
                <Banknote className="mr-2 h-4 w-4 text-muted-foreground" /> Montant du Paiement ({currentTuitionFee?.currency})
              </Label>
              <Input
                id="payment-amount"
                type="number"
                placeholder={`Ex: 100`}
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                disabled={isLoading}
                min="0.01"
                step="0.01"
              />
            </div>
            <Button onClick={handleRecordPayment} disabled={isLoading || !selectedStudentId || !paymentAmount || parseFloat(paymentAmount) <= 0}>
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement...</>
              ) : (
                <><CheckCircle className="mr-2 h-4 w-4" /> Enregistrer le Paiement</>
              )}
            </Button>
          </div>
        )}

        {selectedStudentId && studentPayments.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
                <History className="mr-2 h-5 w-5" /> Historique des Paiements pour {studentsInSelectedClass.find(s=>s.id === selectedStudentId)?.name}
            </h3>
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date du Paiement</TableHead>
                    <TableHead className="text-right">Montant Payé ({currentTuitionFee?.currency})</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentPayments.sort((a,b) => b.datePaid.getTime() - a.datePaid.getTime()).map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{format(new Date(payment.datePaid), "PPP p", { locale: fr })}</TableCell>
                      <TableCell className="text-right">{payment.amountPaid.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
         {selectedStudentId && studentPayments.length === 0 && (
             <p className="text-sm text-muted-foreground mt-1">Aucun paiement enregistré pour cet élève dans cette classe.</p>
         )}


      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Remarque : La gestion du minerval est simulée et les données sont stockées temporairement.
        </p>
      </CardFooter>
    </Card>
  );
}
