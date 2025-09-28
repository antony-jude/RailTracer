"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import { AiChatbot } from '@/components/ai/ai-chatbot';
import { usePathname } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading application...
      </div>
    );
  }

  const getPageTitle = () => {
    if (pathname.startsWith('/dashboard')) return 'Dashboard';
    if (pathname.startsWith('/scan')) return 'Scan Component';
    if (pathname.startsWith('/components/')) return 'Component Details';
    if (pathname.startsWith('/components')) return 'All Components';
    if (pathname.startsWith('/portals')) return 'External Portals';
    return 'RailTracer';
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <AppSidebar />
      </div>
      <div className="flex flex-col">
        <AppHeader pageTitle={getPageTitle()} />
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-background">
          {children}
        </main>
        <AiChatbot />
      </div>
    </div>
  );
}
