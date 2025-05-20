// src/components/layout/Header.tsx
"use client";

import Link from 'next/link';
import { Bell, UserCircle, LogOut, Search } from 'lucide-react'; // Added Search
import { Button } from '@/components/ui/button';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input'; // Added Input
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Added Avatar

export function Header() {
  const { isMobile } = useSidebar();

  return (
    <header className="bg-background text-foreground shadow-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20"> {/* Increased height */}
          <div className="flex items-center">
            {isMobile && (
              <SidebarTrigger className="mr-2 text-foreground hover:bg-muted" />
            )}
            <h1 className="text-2xl font-bold text-foreground">
              Dashboard
            </h1>
          </div>
          
          <div className="flex items-center space-x-4 md:space-x-6">
            {/* Search Bar - hidden on mobile for now */}
            <div className="hidden md:flex items-center bg-muted/50 rounded-lg px-3 py-0.5 w-72">
              <Search className="h-5 w-5 text-muted-foreground mr-2" />
              <Input 
                type="search" 
                placeholder="Search..." 
                className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-9 text-sm shadow-none pl-0"
              />
            </div>

            <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-full">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="user avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden md:inline">Mr. John Doe</span>
            </div>
            {/* Minimal LogOut icon for now, actual functionality needs implementation */}
             <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-full md:hidden">
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Déconnexion</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
