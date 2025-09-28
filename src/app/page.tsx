"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path fill="hsl(var(--primary))" d="M 80,15 C 85,15 90,20 90,25 L 90,75 C 90,80 85,85 80,85 L 20,85 C 15,85 10,80 10,75 L 10,25 C 10,20 15,15 20,15 Z M 50,25 L 25,50 L 50,75 L 75,50 Z" />
          </svg>
        </div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  );
}
