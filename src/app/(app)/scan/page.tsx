
"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { QrCode } from 'lucide-react';
import { MaterialStatusDetector } from '@/components/ai/material-status-detector';
import { Geolocation } from '@/components/geolocation';
import { Separator } from '@/components/ui/separator';
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import jsQR from 'jsqr';

export default function ScanPage() {
  const router = useRouter();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [scanActive, setScanActive] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

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
        setScanActive(true);

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

    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);

  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && canvasRef.current && scanActive) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (ctx) {
            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert',
            });

            if (code) {
                setScanActive(false);
                setScanResult(code.data);
                
                try {
                    const url = new URL(code.data);
                    const pathParts = url.pathname.split('/');
                    const componentId = pathParts[pathParts.length - 1];

                    if (componentId && url.hostname.includes('railtracer.com')) {
                        toast({
                            title: "QR Code Scanned",
                            description: `Redirecting to component ${componentId}...`
                        });
                        router.push(`/components/${componentId}`);
                    } else {
                        throw new Error("Invalid QR code format.");
                    }
                } catch(e) {
                    toast({
                        variant: 'destructive',
                        title: "Invalid QR Code",
                        description: "This QR code is not a valid RailTracer component link.",
                    });
                     // Briefly show the error, then restart scanning
                    setTimeout(() => setScanActive(true), 3000);
                }
            }
        }
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    if (scanActive) {
      animationFrameId = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [scanActive, router, toast]);

  return (
    <div className="space-y-6">
        <Card className="text-center">
            <CardHeader>
                <div className="mx-auto bg-primary text-primary-foreground rounded-full w-20 h-20 flex items-center justify-center">
                    <QrCode className="w-12 h-12" />
                </div>
                <CardTitle className="mt-4 font-headline text-2xl">Scan Component QR Code</CardTitle>
                <CardDescription>
                    {scanActive ? "Point your camera at a QR code to scan it." : "Scan complete."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-full max-w-sm mx-auto aspect-video bg-muted rounded-lg flex items-center justify-center mb-6 overflow-hidden relative">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    <canvas ref={canvasRef} className="hidden" />
                     {scanActive && (
                        <div className="absolute inset-0 border-4 border-accent rounded-lg animate-pulse"></div>
                    )}
                </div>

                {hasCameraPermission === false && (
                    <Alert variant="destructive" className="max-w-sm mx-auto mb-4 text-left">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                        Please allow camera access in your browser settings to use the scanner.
                        </AlertDescription>
                    </Alert>
                )}
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
