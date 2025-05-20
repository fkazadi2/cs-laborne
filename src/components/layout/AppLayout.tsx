// src/components/layout/AppLayout.tsx
"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { Toaster } from '@/components/ui/toaster';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarInset,
} from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Home, Users, UserPlus, ListOrdered, CalendarCheck2, ClipboardList, FileText, FileSpreadsheet, Landmark, BookOpen, Edit3, Megaphone } from 'lucide-react'; // Added Megaphone
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Accueil', icon: Home, exactMatch: true },
  { href: '/public', label: 'Portail Public', icon: Megaphone }, // Changed icon to Megaphone
  { href: '/inscription-eleve', label: 'Inscriptions', icon: UserPlus },
  { href: '/liste-eleves', label: 'Liste Élèves', icon: ListOrdered },
  { href: '/attendance', label: 'Présences', icon: CalendarCheck2 },
  { href: '/grades', label: 'Saisie Notes', icon: ClipboardList },
  { href: '/releve-notes', label: 'Relevé Notes', icon: FileText },
  { href: '/bulletins', label: 'Bulletins', icon: FileSpreadsheet },
  { href: '/minerval', label: 'Minerval', icon: Landmark },
  { href: '/learning-material', label: 'Matériel Pédagogique', icon: BookOpen },
];

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="sidebar" collapsible="icon" side="left" className="border-r border-sidebar-border">
        <SidebarHeader className="p-4">
           <div className="flex items-center gap-2 text-lg font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            <Edit3 className="h-6 w-6" />
            Menu Principal
          </div>
        </SidebarHeader>
        <ScrollArea className="flex-1">
          <SidebarContent>
            <SidebarMenu className="gap-2"> {/* Increased gap between menu items to gap-2 */}
              {navItems.map((item) => {
                const isActive = item.exactMatch ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.label}>
                    <Link href={item.href} legacyBehavior passHref>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={{content: item.label, side: "right", align: "center"}}
                        className={cn(
                            "font-semibold px-4 py-3", // Changed padding to px-4 py-3
                            isActive 
                            ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90" 
                            : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <a>
                          <item.icon />
                          <span>{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
        </ScrollArea>
        {/* SidebarFooter can be added here if needed */}
      </Sidebar>

      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Footer />
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
