"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { QrCode, Camera } from 'lucide-react';
import { getComponents } from '@/lib/data';

export default function ScanPage() {
  const router = useRouter();
  
  const handleScan = () => {
    // Simulate scanning a QR code by picking a random component
    const components = getComponents();
    const randomComponent = components[Math.floor(Math.random() * components.length)];
    router.push(`/components/${randomComponent.id}`);
  };

  return (
    <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <div className="mx-auto bg-primary text-primary-foreground rounded-full w-20 h-20 flex items-center justify-center">
                    <QrCode className="w-12 h-12" />
                </div>
                <CardTitle className="mt-4 font-headline text-2xl">Scan Component</CardTitle>
                <CardDescription>
                    Use your device's camera to scan the laser-engraved QR tag on the railway asset.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center mb-6">
                    <p className="text-muted-foreground">Camera view would appear here</p>
                </div>
                <Button size="lg" className="w-full" onClick={handleScan}>
                    <Camera className="mr-2 h-5 w-5" />
                    Simulate Scan
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
