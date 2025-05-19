
// src/lib/school-data-store.ts
"use client";

// Import StudentRegistrationFormValues from the form component itself
// This assumes StudentRegistrationFormValues is exported from student-registration-form.tsx
import type { StudentRegistrationFormValues } from '@/components/student-registration-form';

export interface Student {
  id: string;
  name: string;
  attendance?: 'present' | 'absent' | 'late' | 'not_set';
}

export interface ClassData {
  id: string;
  name: string;
  students: Student[];
}

export interface Subject {
  id: string;
  name: string;
}

let MOCK_CLASSES_STORE: ClassData[] = [
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

export const MOCK_SUBJECTS_STORE: Subject[] = [
  { id: 'math', name: 'Mathématiques' },
  { id: 'french', name: 'Français' },
  { id: 'science', name: 'Sciences' },
  { id: 'history', name: 'Histoire' },
];

// Store for detailed student registrations
let MOCK_REGISTERED_STUDENTS_DETAILS: StudentRegistrationFormValues[] = [];

let listeners: (() => void)[] = [];

export const getClasses = (): ClassData[] => {
  return JSON.parse(JSON.stringify(MOCK_CLASSES_STORE)); // Return a deep copy
};

export const getSubjects = (): Subject[] => {
  return JSON.parse(JSON.stringify(MOCK_SUBJECTS_STORE)); // Return a deep copy
}

export const addStudentToClass = (classId: string, studentName: string): string => {
  const classObj = MOCK_CLASSES_STORE.find(c => c.id === classId);
  const newStudentId = `s_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  if (classObj) {
    classObj.students.push({ id: newStudentId, name: studentName, attendance: 'not_set' });
    notifyListeners();
  } else {
    console.warn(`Classe avec ID ${classId} non trouvée dans le magasin.`);
  }
  return newStudentId; // Return the new student ID
};

// Functions for detailed student registrations
export const addRegisteredStudentDetails = (details: StudentRegistrationFormValues): void => {
  MOCK_REGISTERED_STUDENTS_DETAILS.push(JSON.parse(JSON.stringify(details))); // Store a deep copy
  notifyListeners();
};

export const getRegisteredStudentDetails = (): StudentRegistrationFormValues[] => {
  return JSON.parse(JSON.stringify(MOCK_REGISTERED_STUDENTS_DETAILS)); // Return a deep copy
};


export const subscribe = (listener: () => void): (() => void) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
};

const notifyListeners = (): void => {
  for (const listener of listeners) {
    listener();
  }
};

export const CLASSES_AVAILABLE_FOR_REGISTRATION = MOCK_CLASSES_STORE.map(cls => ({ id: cls.id, name: cls.name }));
