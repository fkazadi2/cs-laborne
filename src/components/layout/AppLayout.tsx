// src/components/layout/AppLayout.tsx
"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Home, UserPlus, ListOrdered, CalendarCheck2, ClipboardList, FileText, FileSpreadsheet, Landmark, BookOpen, Megaphone, Download, Settings, HelpCircle, LogOut, LayoutGrid, Library, FileDigit, Users, BarChart3, Award, CalendarDays, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card as UICard, CardContent as UICardContent } from '@/components/ui/card'; // Renamed to avoid conflict

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutGrid, exactMatch: true },
  { href: '/public', label: 'Portail Public', icon: Megaphone },
  { href: '/inscription-eleve', label: 'Inscriptions', icon: UserPlus },
  { href: '/liste-eleves', label: 'Liste Élèves', icon: ListOrdered },
  { href: '/attendance', label: 'Présences', icon: CalendarCheck2 },
  { href: '/grades', label: 'Saisie Notes', icon: ClipboardList },
  { href: '/releve-notes', label: 'Relevé Notes', icon: FileText },
  { href: '/bulletins', label: 'Bulletins', icon: FileSpreadsheet },
  { href: '/minerval', label: 'Minerval', icon: Landmark },
  { href: '/learning-material', label: 'Matériel Pédagogique', icon: BookOpen },
];

const utilityNavItems = [
    { href: '#', label: 'Settings', icon: Settings },
    { href: '#', label: 'Help Center', icon: HelpCircle },
    { href: '#', label: 'Log Out', icon: LogOut },
];

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="sidebar" collapsible="icon" side="left" className="bg-sidebar border-r-0">
        <SidebarHeader className="p-4 pt-6 pb-3 flex flex-col items-center group-data-[collapsible=icon]:items-center">
           <div className="mb-6 mt-2 group-data-[collapsible=icon]:hidden">
            <Link href="/" passHref>
                <Image
                    src="/logo.png" // Assurez-vous que logo.png est dans le dossier public
                    alt="La Borne Connect Logo"
                    width={120} // Ajustez la taille au besoin
                    height={40} // Ajustez la taille au besoin
                    priority
                    data-ai-hint="school logo"
                />
            </Link>
          </div>
           <div className="hidden items-center justify-center group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:mb-4">
             <Link href="/" passHref>
                 <Image
                    src="/logo.png" // Assurez-vous que logo.png est dans le dossier public
                    alt="La Borne Connect Logo Icon"
                    width={36} // Taille pour le mode icône
                    height={36} // Taille pour le mode icône
                    priority
                    className="rounded-full"
                    data-ai-hint="school logo icon"
                 />
             </Link>
          </div>
        </SidebarHeader>
        <ScrollArea className="flex-1">
          <SidebarContent className="px-2">
            <SidebarMenu className="gap-2">
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
                            "font-semibold px-4 py-3 text-sm justify-start",
                            isActive 
                            ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90" 
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            "group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                        )}
                      >
                        <a>
                          <item.icon className="h-5 w-5" />
                          <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
        </ScrollArea>
        <SidebarFooter className="p-4 border-t border-sidebar-border/30 group-data-[collapsible=icon]:hidden">
            <UICard className="bg-gradient-to-br from-primary-foreground/10 to-accent/10 border-none shadow-md overflow-hidden">
                <UICardContent className="p-4 text-center">
                    <div className="mb-3">
                        <Image src="https://placehold.co/80x80/7c3aed/ffffff.png?text=📱" alt="Mobile App" width={60} height={60} className="mx-auto rounded-lg" data-ai-hint="mobile app icon"/>
                    </div>
                    <p className="text-sm font-semibold text-sidebar-foreground mb-1">Download the Mobile App</p>
                    <p className="text-xs text-sidebar-foreground/70 mb-3">Get the full experience on your phone.</p>
                    <Button variant="outline" size="sm" className="w-full bg-sidebar-foreground text-sidebar-background hover:bg-sidebar-foreground/90">
                        <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                </UICardContent>
            </UICard>
            
            <div className="mt-4">
                 <SidebarMenu className="gap-1">
                    {utilityNavItems.map((item) => (
                        <SidebarMenuItem key={item.label}>
                            <Link href={item.href} legacyBehavior passHref>
                            <SidebarMenuButton
                                asChild
                                tooltip={{content: item.label, side: "right", align: "center"}}
                                className={cn(
                                    "font-medium px-3 py-2 text-xs justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                     "group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                                )}
                            >
                                <a>
                                <item.icon className="h-4 w-4" />
                                <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                                </a>
                            </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                 </SidebarMenu>
            </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          {/* <Footer /> */}
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
