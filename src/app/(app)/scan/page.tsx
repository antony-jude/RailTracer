
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
import { useComponents } from '@/contexts/component-context';
import type { RailwayComponent } from '@/lib/types';
import { GeoPoint } from 'firebase/firestore';

export default function ScanPage() {
  const router = useRouter();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [scanActive, setScanActive] = useState(false);
  const { getComponentById, addComponent, updateComponent } = useComponents();
  const [currentPosition, setCurrentPosition] = useState<{latitude: number, longitude: number} | null>(null);

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
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: "environment",
                width: { ideal: 640 },
                height: { ideal: 480 }
            } 
        });
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

    const watchLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    setCurrentPosition({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                () => {
                    toast({
                        variant: 'destructive',
                        title: 'Location Error',
                        description: 'Could not get your location. Component location will not be updated.',
                    });
                }
            );
        }
    };

    getCameraPermission();
    watchLocation();

    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);

  useEffect(() => {
    let animationFrameId: number;

    const parseVCard = (vcard: string): Partial<RailwayComponent> & { url?: string } => {
        const lines = vcard.split('\n');
        const data: any = {};
        lines.forEach(line => {
            if (line.startsWith('FN:')) {
                const fn = line.substring(3);
                const match = fn.match(/(.*) \((.*)\)/);
                if (match) {
                    data.name = match[1].trim();
                    data.id = match[2].trim();
                } else {
                    data.name = fn.trim();
                }
            }
            if (line.startsWith('CATEGORIES:')) data.type = line.substring(11).trim();
            if (line.startsWith('URL:')) data.url = line.substring(4).trim();
            if (line.startsWith('NOTE:')) {
                const notes = line.substring(5).split('\\n');
                notes.forEach(note => {
                    const [key, value] = note.split(': ');
                    if (key && value) {
                        const val = value.trim();
                        if (key === 'Location') data.location = val;
                        if (key === 'Vendor') data.vendor = val;
                        if (key === 'Install Date') data.installDate = new Date().toISOString(); // Set current date as install date on first scan
                        if (key === 'Warranty Until') data.warrantyUntil = new Date(val).toISOString();
                        if (key === 'Supply Date') data.supplyDate = new Date(val).toISOString();
                    }
                });
            }
        });
        return data;
    }

    const handleScan = async (scannedData: string) => {
        setScanActive(false);
        toast({ title: "QR Code Found", description: "Processing..." });

        let componentId: string | undefined;
        let isNewComponent = false;

        // 1. Try to parse as vCard for new components
        if (scannedData.startsWith('BEGIN:VCARD')) {
            const vcardData = parseVCard(scannedData);
            if (vcardData.id) {
                const existingComponent = await getComponentById(vcardData.id);
                if (!existingComponent) {
                    const newComponent: Omit<RailwayComponent, 'id'> = {
                        id: vcardData.id!,
                        name: vcardData.name || 'Unknown',
                        type: vcardData.type || 'Unknown',
                        location: vcardData.location || 'Unknown',
                        vendor: vcardData.vendor || 'Unknown',
                        supplyDate: vcardData.supplyDate || new Date().toISOString(),
                        warrantyUntil: vcardData.warrantyUntil || new Date().toISOString(),
                        installDate: new Date().toISOString(), // Set install date on first scan
                        currentState: 'Verified',
                        qrCode: vcardData.url || `${window.location.origin}/components/${vcardData.id}`,
                        history: [],
                        geoPosition: currentPosition ? new GeoPoint(currentPosition.latitude, currentPosition.longitude) : undefined,
                    };
                    await addComponent(newComponent);
                    isNewComponent = true;
                    toast({
                        title: "New Component Registered",
                        description: `Component ${vcardData.id} has been added.`
                    });
                }
                componentId = vcardData.id;
            }
        } else {
            // 2. Try to parse as a URL for existing components
            try {
                const url = new URL(scannedData);
                const pathParts = url.pathname.split('/');
                if (pathParts.length >= 3 && pathParts[pathParts.length - 2] === 'components') {
                    componentId = pathParts[pathParts.length - 1];
                }
            } catch (e) {
                // Not a valid URL, will be handled by the final check
            }
        }

        // 3. Navigate or show error
        if (componentId) {
            if (!isNewComponent && currentPosition) {
                await updateComponent(componentId, { 
                    geoPosition: new GeoPoint(currentPosition.latitude, currentPosition.longitude),
                    location: `Scanned at ${currentPosition.latitude.toFixed(4)}, ${currentPosition.longitude.toFixed(4)}`
                });
            }
            toast({
                title: "Scan Successful",
                description: `Navigating to component ${componentId}...`
            });
            router.push(`/components/${componentId}`);
        } else {
            toast({
                variant: 'destructive',
                title: "Invalid QR Code",
                description: "This QR code is not recognized. Please try again.",
            });
            // Briefly show the error, then restart scanning
            setTimeout(() => setScanActive(true), 3000);
        }
    };


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
                handleScan(code.data);
            }
        }
      }
      if (scanActive) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    if (scanActive) {
      animationFrameId = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [scanActive, router, toast, addComponent, getComponentById, updateComponent, currentPosition]);

  return (
    <div className="space-y-6">
        <Card className="text-center">
            <CardHeader>
                <div className="mx-auto bg-primary text-primary-foreground rounded-full w-20 h-20 flex items-center justify-center">
                    <QrCode className="w-12 h-12" />
                </div>
                <CardTitle className="mt-4 font-headline text-2xl">Scan Component QR Code</CardTitle>
                <CardDescription>
                    {scanActive ? "Point your camera at a QR code to scan it." : "Processing..."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-full max-w-sm mx-auto aspect-square bg-muted rounded-lg flex items-center justify-center mb-6 overflow-hidden relative">
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

    