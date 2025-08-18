'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AreaChart, BrainCircuit, Clapperboard, LogOut, Settings, Users, Zap, BookOpen } from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const navItems = [
  { href: '/dashboard', icon: <Zap />, label: 'Dashboard' },
  { href: '/dashboard/ai-core', icon: <BrainCircuit />, label: 'AI Core' },
  { href: '/dashboard/content-suite', icon: <Clapperboard />, label: 'Content Suite' },
  { href: '/dashboard/trading-hub', icon: <AreaChart />, label: 'Trading Hub' },
  { href: '/dashboard/virtual-lounge', icon: <Users />, label: 'Virtual Lounge' },
  { href: '/dashboard/courses', icon: <BookOpen />, label: 'Courses' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeLabel = navItems.find(item => pathname.startsWith(item.href))?.label || 'Dashboard';

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex flex-col items-center text-center p-2 group-data-[collapsible=icon]:p-0">
            <Link href="/dashboard" className="flex items-center gap-2 mb-2 group-data-[collapsible=icon]:mb-0">
              <Zap className="w-8 h-8 text-primary" />
              <h1 className="text-xl font-bold font-headline group-data-[collapsible=icon]:hidden">Cyber Jungle</h1>
            </Link>
            <p className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
              Proudly Developed By CVJ The Cyber Wolf
            </p>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton isActive={pathname.startsWith(item.href)} tooltip={item.label}>
                    {item.icon}
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center w-full gap-2 p-2 rounded-md hover:bg-sidebar-accent transition-colors">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://placehold.co/100x100.png" alt="@user" data-ai-hint="avatar profile" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">
                        <span className="text-sm font-semibold">User</span>
                        <span className="text-xs text-muted-foreground">user@cvj.com</span>
                    </div>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Link href="/">
                    <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
           </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b h-14 bg-background/80 backdrop-blur-sm">
          <SidebarTrigger />
          <h2 className="text-2xl font-bold font-headline">{activeLabel}</h2>
          <Button variant="outline">Feedback</Button>
        </header>
        <main 
          className="relative flex-1 p-4 md:p-6 lg:p-8 overflow-auto"
          style={{
            backgroundImage: `
              linear-gradient(rgba(18, 18, 18, 0.85), rgba(18, 18, 18, 0.85)),
              url('https://placehold.co/1920x1080.png')
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="absolute inset-0 -z-10 h-full w-full bg-background/90 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
