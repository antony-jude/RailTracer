"use client";

import { useState, useEffect } from 'react';
import { Cloud, CloudOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function SyncIndicator() {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
      setIsOnline(window.navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  if (isOnline === null) {
    return null;
  }

  const tooltipText = isOnline ? 'Online: Data is synchronized.' : 'Offline: Changes will sync when back online.';
  const Icon = isOnline ? Cloud : CloudOff;
  const colorClass = isOnline ? 'text-green-500' : 'text-amber-500';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon className={`h-5 w-5 ${colorClass}`} />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
}
