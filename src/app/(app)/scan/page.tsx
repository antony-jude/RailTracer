"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { QrCode, Camera } from 'lucide-react';
import { getComponents } from '@/lib/data';
import { MaterialStatusDetector } from '@/components/ai/material-status-detector';
import { Geolocation } from '@/components/geolocation';
import { Separator } from '@/components/ui/separator';
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function ScanPage() {
  const router = useRouter();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  
  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Unsupported Browser',
          description: 'Your browser does not support camera access.',
        });
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();
  }, [toast]);


  const handleScan = () => {
    // Simulate scanning a QR code by picking a random component
    const components = getComponents();
    const randomComponent = components[Math.floor(Math.random() * components.length)];
    toast({
        title: "QR Code Scanned",
        description: `Redirecting to component ${randomComponent.id}...`
    })
    router.push(`/components/${randomComponent.id}`);
  };

  return (
    <div className="space-y-6">
        <Card className="text-center">
            <CardHeader>
                <div className="mx-auto bg-primary text-primary-foreground rounded-full w-20 h-20 flex items-center justify-center">
                    <QrCode className="w-12 h-12" />
                </div>
                <CardTitle className="mt-4 font-headline text-2xl">Scan Component QR Code</CardTitle>
                <CardDescription>
                    Point your device's camera at the laser-engraved QR tag on the railway asset.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-full max-w-sm mx-auto aspect-video bg-muted rounded-lg flex items-center justify-center mb-6 overflow-hidden">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                </div>

                {hasCameraPermission === false && (
                    <Alert variant="destructive" className="max-w-sm mx-auto mb-4 text-left">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                        Please allow camera access in your browser settings to use the scanner.
                        </AlertDescription>
                    </Alert>
                )}

                <Button size="lg" className="w-full max-w-sm mx-auto" onClick={handleScan}>
                    <Camera className="mr-2 h-5 w-5" />
                    Simulate Scan
                </Button>
            </CardContent>
        </Card>

        <Separator />

        <div className="grid md:grid-cols-2 gap-6">
            <MaterialStatusDetector />
            <Geolocation />
        </div>
    </div>
  );
}
