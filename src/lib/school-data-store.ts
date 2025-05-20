
// src/lib/school-data-store.ts
"use client";

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

export interface StudentGrade {
  studentId: string;
  classId: string;
  subjectId: string;
  grade: number;
}

export interface TuitionFee {
  classId: string;
  amount: number;
  currency?: string; // e.g., "USD", "EUR", "CDF"
}

export interface PaymentRecord {
  id: string;
  studentId: string;
  classId: string;
  amountPaid: number;
  datePaid: Date;
  currency?: string;
}

let MOCK_CLASSES_STORE: ClassData[] = [
  {
    id: 'class_a',
    name: '10ème Année',
    students: [
      { id: 's1', name: 'Grace Ilunga', attendance: 'not_set' },
      { id: 's2', name: 'Daniel Kazadi', attendance: 'not_set' },
      { id: 's3', name: 'Sarah Mbuyi', attendance: 'not_set' },
      { id: 's4', name: 'David Mutombo', attendance: 'not_set' },
      { id: 's5', name: 'Esther Kalonji', attendance: 'not_set' },
    ],
  },
  {
    id: 'class_b',
    name: '11ème Année',
    students: [
      { id: 's6', name: 'Samuel Ngalula', attendance: 'not_set' },
      { id: 's7', name: 'Ruth Tshibangu', attendance: 'not_set' },
      { id: 's8', name: 'Jonathan Kabongo', attendance: 'not_set' },
      { id: 's9', name: 'Deborah Kasongo', attendance: 'not_set' },
    ],
  },
  {
    id: 'class_c',
    name: '12ème Année',
    students: [
      { id: 's10', name: 'Moise Lunda', attendance: 'not_set' },
      { id: 's11', name: 'Noella Mwamba', attendance: 'not_set' },
      { id: 's12', name: 'Joshua Mukendi', attendance: 'not_set' },
    ],
  }
];

export const MOCK_SUBJECTS_STORE: Subject[] = [
  { id: 'math', name: 'Mathématiques' },
  { id: 'french', name: 'Français' },
  { id: 'science', name: 'Sciences' },
  { id: 'history', name: 'Histoire' },
];

let MOCK_GRADES_STORE: StudentGrade[] = [];
let MOCK_REGISTERED_STUDENTS_DETAILS: StudentRegistrationFormValues[] = [];

const MOCK_TUITION_FEES_STORE: TuitionFee[] = [
    { classId: 'class_a', amount: 500, currency: 'USD' },
    { classId: 'class_b', amount: 550, currency: 'USD' },
    { classId: 'class_c', amount: 600, currency: 'USD' },
];

let MOCK_PAYMENTS_STORE: PaymentRecord[] = [];


let listeners: (() => void)[] = [];

export const getClasses = (): ClassData[] => {
  return JSON.parse(JSON.stringify(MOCK_CLASSES_STORE));
};

export const getSubjects = (): Subject[] => {
  return JSON.parse(JSON.stringify(MOCK_SUBJECTS_STORE));
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
  return newStudentId;
};

export const getStudentById = (studentId: string): Student | undefined => {
  for (const classData of MOCK_CLASSES_STORE) {
    const student = classData.students.find(s => s.id === studentId);
    if (student) {
      return JSON.parse(JSON.stringify(student));
    }
  }
  return undefined;
};

export const addRegisteredStudentDetails = (details: StudentRegistrationFormValues): void => {
  MOCK_REGISTERED_STUDENTS_DETAILS.push(JSON.parse(JSON.stringify(details)));
  notifyListeners();
};

export const getRegisteredStudentDetails = (): StudentRegistrationFormValues[] => {
  return JSON.parse(JSON.stringify(MOCK_REGISTERED_STUDENTS_DETAILS));
};

export const getTotalRegisteredStudents = (): number => {
  return MOCK_REGISTERED_STUDENTS_DETAILS.length;
};

export const getStudentCountsPerClass = (): { name: string, students: number }[] => {
  return MOCK_CLASSES_STORE.map(cls => ({ name: cls.name, students: cls.students.length }));
};

export const getOverallPerformanceSummary = (passingGrade: number = 10): { passed: number, failed: number, notGraded: number } => {
  let passed = 0;
  let failed = 0;
  let gradedCount = 0;

  MOCK_GRADES_STORE.forEach(gradeEntry => {
    if (typeof gradeEntry.grade === 'number' && !isNaN(gradeEntry.grade)) {
      gradedCount++;
      if (gradeEntry.grade >= passingGrade) {
        passed++;
      } else {
        failed++;
      }
    }
  });

  let totalPossibleGrades = 0;
  MOCK_CLASSES_STORE.forEach(cls => {
    totalPossibleGrades += cls.students.length * MOCK_SUBJECTS_STORE.length;
  });
  const notGraded = totalPossibleGrades - gradedCount;

  return { passed, failed, notGraded: Math.max(0, notGraded) };
};


export const setStudentGrade = (classId: string, studentId: string, subjectId: string, grade: number): void => {
  const existingGradeIndex = MOCK_GRADES_STORE.findIndex(
    g => g.studentId === studentId && g.subjectId === subjectId && g.classId === classId
  );
  if (isNaN(grade)) {
    if (existingGradeIndex > -1) {
      MOCK_GRADES_STORE.splice(existingGradeIndex, 1);
    }
  } else {
    if (existingGradeIndex > -1) {
      MOCK_GRADES_STORE[existingGradeIndex].grade = grade;
    } else {
      MOCK_GRADES_STORE.push({ classId, studentId, subjectId, grade });
    }
  }
  notifyListeners();
};

export const getStudentGrade = (classId: string, studentId: string, subjectId: string): number | undefined => {
  const foundGrade = MOCK_GRADES_STORE.find(g => g.studentId === studentId && g.subjectId === subjectId && g.classId === classId);
  return foundGrade?.grade;
};

export const getGradesForClassSubject = (classId: string, subjectId: string): StudentGrade[] => {
    return JSON.parse(JSON.stringify(MOCK_GRADES_STORE.filter(g => g.classId === classId && g.subjectId === subjectId)));
}

export const getAllGradesForClass = (classId: string): StudentGrade[] => {
  return JSON.parse(JSON.stringify(MOCK_GRADES_STORE.filter(g => g.classId === classId)));
};

export const getStudentGradesForClass = (studentId: string, classId: string): { subject: Subject; grade?: number }[] => {
  const subjects = getSubjects();
  const studentGradesForClass = MOCK_GRADES_STORE.filter(
    (g) => g.studentId === studentId && g.classId === classId
  );

  return subjects.map((subject) => {
    const gradeEntry = studentGradesForClass.find((g) => g.subjectId === subject.id);
    return {
      subject,
      grade: gradeEntry?.grade,
    };
  });
};

// --- Tuition Management Functions ---
export const getTuitionFeeForClass = (classId: string): TuitionFee | undefined => {
  return JSON.parse(JSON.stringify(MOCK_TUITION_FEES_STORE.find(fee => fee.classId === classId)));
};

export const recordPayment = (studentId: string, classId: string, amountPaid: number, currency: string = 'USD'): void => {
  const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  MOCK_PAYMENTS_STORE.push({
    id: paymentId,
    studentId,
    classId,
    amountPaid,
    datePaid: new Date(),
    currency,
  });
  notifyListeners();
};

export const getPaymentsForStudent = (studentId: string, classId: string): PaymentRecord[] => {
  return JSON.parse(JSON.stringify(MOCK_PAYMENTS_STORE.filter(
    payment => payment.studentId === studentId && payment.classId === classId
  )));
};

export const getOutstandingBalanceForStudent = (studentId: string, classId: string): { balance: number, currency: string, feeAmount: number, totalPaid: number } => {
  const fee = getTuitionFeeForClass(classId);
  if (!fee) {
    return { balance: 0, currency: 'USD', feeAmount: 0, totalPaid: 0 }; // Or handle as error
  }
  const payments = getPaymentsForStudent(studentId, classId);
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amountPaid, 0);
  const balance = fee.amount - totalPaid;
  return { balance, currency: fee.currency || 'USD', feeAmount: fee.amount, totalPaid };
};
// --- End Tuition Management Functions ---


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

const initializeMockGrades = () => {
  if (MOCK_GRADES_STORE.length === 0) {
    const classes = MOCK_CLASSES_STORE;
    const subjects = MOCK_SUBJECTS_STORE;
    classes.forEach(cls => {
      cls.students.forEach(student => {
        subjects.forEach(subject => {
          if (Math.random() > 0.2) {
            let grade = Math.random() * 12 + 8;
            if (subject.name === "Mathématiques" && student.name.includes("Sarah")) grade = Math.random() * 5 + 5;
            if (student.name.includes("Daniel") && Math.random() > 0.3) grade = Math.random() * 5 + 15;
             MOCK_GRADES_STORE.push({
              classId: cls.id,
              studentId: student.id,
              subjectId: subject.id,
              grade: parseFloat(grade.toFixed(1))
            });
          }
        });
      });
    });
  }
};

initializeMockGrades();
notifyListeners();
