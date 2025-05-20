
// src/components/layout/Header.tsx
"use client";

import Link from 'next/link';
import { Edit3, Bell, UserCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export function Header() {
  const { isMobile } = useSidebar();

  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-40"> {/* z-40 to be under sidebar sheet (z-50) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {isMobile && (
              <SidebarTrigger className="mr-2 text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground" />
            )}
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary-foreground">
              <Edit3 className="h-8 w-8" />
              <span>La Borne Connect</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-3">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">
              <UserCircle className="h-5 w-5" />
              <span className="sr-only">Profil</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Déconnexion</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
