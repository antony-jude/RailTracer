"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, QrCode, Wrench, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/scan', icon: QrCode, label: 'Scan Component' },
  { href: '/components', icon: Wrench, label: 'Components' },
  { href: '/portals', icon: Globe, label: 'External Portals' },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isComponentsPath = (path: string) => {
    return path.startsWith('/components');
  };

  return (
    <TooltipProvider>
        <aside className="flex h-full flex-col border-r bg-card">
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold font-headline">
                    <div className="w-8 h-8">
                        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <path fill="hsl(var(--primary))" d="M 80,15 C 85,15 90,20 90,25 L 90,75 C 90,80 85,85 80,85 L 20,85 C 15,85 10,80 10,75 L 10,25 C 10,20 15,15 20,15 Z M 50,25 L 25,50 L 50,75 L 75,50 Z" />
                        </svg>
                    </div>
                    <span className="">RailTracer</span>
                </Link>
            </div>
            <nav className="flex-1 overflow-auto py-4">
                    <ul className="grid items-start px-4 text-sm font-medium">
                        {navItems.map(({ href, icon: Icon, label }) => {
                            const isActive = href === '/components' ? isComponentsPath(pathname) : pathname === href;
                            return (
                                <li key={href}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href={href}
                                                className={cn(
                                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-card-foreground/70 transition-all hover:text-primary hover:bg-secondary',
                                                    isActive && 'bg-secondary text-primary'
                                                )}
                                            >
                                                <Icon className="h-4 w-4" />
                                                {label}
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            <p>{label}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </li>
                            );
                        })}
                    </ul>
            </nav>
        </aside>
    </TooltipProvider>
  );
}
