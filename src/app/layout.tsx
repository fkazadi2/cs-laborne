import type {Metadata} from 'next';
import { Geist, Geist_Mono } from 'next/font/google'; // Corrected font import
import './globals.css';
import { AppLayout } from '@/components/layout/AppLayout';

const geistSans = Geist({ // Corrected usage
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({ // Corrected usage
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'La Borne Connect',
  description: 'School Management System for C.S. La Borne',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
