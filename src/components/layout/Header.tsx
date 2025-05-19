
// src/components/layout/Header.tsx
"use client";

import Link from 'next/link';
import { BookOpen, Edit3, Home, Users, CalendarCheck2, UserPlus, ClipboardList } from 'lucide-react'; // Ajout de ClipboardList
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/', label: 'Accueil', icon: Home },
  { href: '/public', label: 'Portail Public', icon: Users },
  { href: '/inscription-eleve', label: 'Inscriptions', icon: UserPlus },
  { href: '/attendance', label: 'Présences', icon: CalendarCheck2 },
  { href: '/grades', label: 'Notes et Bulletins', icon: ClipboardList }, // Ajout du lien Notes et Bulletins
  { href: '/learning-material', label: 'Matériel Pédagogique', icon: BookOpen },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
              <Edit3 className="h-8 w-8" />
              <span>La Borne Connect</span>
            </Link>
          </div>
          <nav className="hidden md:flex flex-wrap justify-center space-x-1 lg:space-x-1"> {/* Ajustement pour flex-wrap et spacing */}
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant={pathname === item.href ? 'default' : 'ghost'}
                asChild
                className={cn(
                  "font-medium px-2.5 py-2 text-xs lg:text-sm", // Ajustement de la taille pour plus d'items
                  pathname === item.href ? "text-primary-foreground" : "text-foreground hover:text-primary"
                )}
              >
                <Link href={item.href} className="flex items-center gap-1.5 lg:gap-2">
                  <item.icon className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
          {/* Mobile menu button could be added here */}
        </div>
      </div>
    </header>
  );
}
