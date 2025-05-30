
"use client";

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Loader2, FileText, UserPlus } from 'lucide-react';
import { fr } from "date-fns/locale";
import { addStudentToClass, addRegisteredStudentDetails, CLASSES_AVAILABLE_FOR_REGISTRATION } from '@/lib/school-data-store';

// Exporting the schema and type for use in school-data-store.ts
export const studentRegistrationSchema = z.object({
  // Adding an ID field that will be generated upon submission for the detailed list
  id: z.string().optional(), 
  nomEleve: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  prenomEleve: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères." }),
  dateNaissance: z.date({ required_error: "La date de naissance est requise." }),
  lieuNaissance: z.string().min(2, { message: "Le lieu de naissance est requis." }),
  adresseEleve: z.string().min(10, { message: "L'adresse doit contenir au moins 10 caractères." }),
  nomTuteur: z.string().min(2, { message: "Le nom du tuteur doit contenir au moins 2 caractères." }),
  telephoneTuteur: z.string().regex(/^\+?[0-9\s-()]{7,20}$/, { message: "Numéro de téléphone invalide." }),
  emailTuteur: z.string().email({ message: "Adresse e-mail invalide." }),
  classeSouhaitee: z.string({ required_error: "Veuillez sélectionner une classe." }),
  documents: z.custom<FileList | null>((val) => val instanceof FileList || val === null, "Veuillez sélectionner des fichiers.")
    .refine(files => files === null || files.length > 0, 'Au moins un document est requis.')
    .optional(),
  photoIdentite: z.custom<FileList | null>((val) => val instanceof FileList || val === null, "Veuillez sélectionner un fichier.")
    .refine(files => files === null || files.length === 1, 'Une seule photo d\'identité est requise.')
    .optional(),
});

export type StudentRegistrationFormValues = z.infer<typeof studentRegistrationSchema>;

export function StudentRegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<StudentRegistrationFormValues>({
    resolver: zodResolver(studentRegistrationSchema),
    defaultValues: {
      nomEleve: '',
      prenomEleve: '',
      lieuNaissance: '',
      adresseEleve: '',
      nomTuteur: '',
      telephoneTuteur: '',
      emailTuteur: '',
      documents: null,
      photoIdentite: null,
    },
  });

  async function onSubmit(data: StudentRegistrationFormValues) {
    setIsLoading(true);
    
    // Generate a unique ID for this registration entry and for the student in the class list
    const uniqueId = `reg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const studentFullName = `${data.prenomEleve} ${data.nomEleve}`;

    // Add student to class roster (this function in store now returns the student's ID in the class)
    // We'll use the same uniqueId for consistency, though the store might generate its own internal student ID.
    // For simplicity now, let's assume addStudentToClass uses a similar ID generation or we can pass it.
    // The current addStudentToClass in store generates its own 's_...' ID. We'll use that.
    const studentIdInClass = addStudentToClass(data.classeSouhaitee, studentFullName);

    // Prepare the data for the detailed registration store, including the ID
    const registrationDetails: StudentRegistrationFormValues = {
      ...data,
      id: uniqueId, // This ID is for the registration entry itself.
    };

    addRegisteredStudentDetails(registrationDetails);
    console.log("Données d'inscription soumises et enregistrées dans le magasin:", registrationDetails);


    await new Promise(resolve => setTimeout(resolve, 200)); 
    setIsLoading(false);

    toast({
      title: "Inscription Soumise !",
      description: `La demande d'inscription pour ${studentFullName} dans la classe ${CLASSES_AVAILABLE_FOR_REGISTRATION.find(c => c.id === data.classeSouhaitee)?.name} a été enregistrée.`,
      action: <CheckCircle className="text-green-500" />,
    });
    form.reset();
  }

  return (
    <Card className="shadow-lg rounded-lg w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-primary flex items-center">
          <UserPlus className="mr-2 h-6 w-6" /> Formulaire d'Inscription
        </CardTitle>
        <CardDescription>
          Veuillez remplir tous les champs attentivement. Les champs marqués d'un * sont obligatoires.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="nomEleve"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'élève *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Dupont" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prenomEleve"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom de l'élève *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Jean" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="dateNaissance"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de naissance *</FormLabel>
                    <FormControl>
                       <DatePicker
                        date={field.value}
                        setDate={field.onChange}
                        placeholder="Sélectionnez une date"
                        calendarProps={{
                          locale: fr,
                          disabled: (date) => date > new Date() || date < new Date("1950-01-01"),
                          captionLayout: "dropdown-buttons",
                          fromYear: 1950,
                          toYear: new Date().getFullYear(),
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="lieuNaissance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lieu de naissance *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Kinshasa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="adresseEleve"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse complète de l'élève *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ex: 123, Avenue de l'École, Commune de la Gombe, Kinshasa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <h3 className="text-lg font-semibold text-primary pt-4 border-t mt-6">Informations du Tuteur Légal</h3>
            
            <FormField
              control={form.control}
              name="nomTuteur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet du tuteur *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Marie Dubois" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="telephoneTuteur"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de téléphone du tuteur *</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Ex: +243 810 000 000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emailTuteur"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse e-mail du tuteur *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Ex: tuteur@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold text-primary pt-4 border-t mt-6">Informations Scolaires</h3>
            <FormField
              control={form.control}
              name="classeSouhaitee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classe souhaitée *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une classe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CLASSES_AVAILABLE_FOR_REGISTRATION.map((classe) => (
                        <SelectItem key={classe.id} value={classe.id}>
                          {classe.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <h3 className="text-lg font-semibold text-primary pt-4 border-t mt-6">Documents à Fournir</h3>
            <FormField
              control={form.control}
              name="documents"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Documents requis (Ex: Acte de naissance, bulletins précédents)</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      multiple 
                      data-ai-hint="document resume"
                      onChange={(e) => onChange(e.target.files)}
                      {...rest}
                      className="pt-2"
                    />
                  </FormControl>
                  <FormDescription>
                    Vous pouvez sélectionner plusieurs fichiers. Le traitement et stockage des fichiers sera implémenté ultérieurement.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="photoIdentite"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Photo d'identité de l'élève (format .jpg, .png)</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      accept="image/jpeg, image/png"
                      data-ai-hint="student portrait"
                      onChange={(e) => onChange(e.target.files)}
                      {...rest}
                       className="pt-2"
                    />
                  </FormControl>
                  <FormDescription>
                    Une photo claire et récente de l'élève.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Soumission en cours...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Soumettre l'Inscription
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

