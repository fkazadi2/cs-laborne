import { AttendanceForm } from '@/components/attendance-form';
import { CalendarClock } from 'lucide-react';

export const metadata = {
  title: 'Attendance Input - La Borne Connect',
  description: 'Easily input student attendance for classes.',
};

export default function AttendancePage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-3 rounded-full mb-4">
            <CalendarClock className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">Simple Attendance Input</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Teachers can quickly and efficiently record student attendance for each class session.
        </p>
      </section>
      <AttendanceForm />
    </div>
  );
}
