
"use client";

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { QrCode } from 'lucide-react';
import { MaterialStatusDetector } from '@/components/ai/material-status-detector';
import { Geolocation } from '@/components/geolocation';
import { Separator } from '@/components/ui/separator';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import jsQR from 'jsqr';
import { useComponents } from '@/contexts/component-context';
import type { RailwayComponent, Inspection, ComponentState } from '@/lib/types';
import { GeoPoint } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import { UpdateStatusDialog } from '@/components/component/update-status-dialog';

export default function ScanPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [scanActive, setScanActive] = useState(false);
  const { getComponentById, addComponent, updateComponent } = useComponents();
  const [currentPosition, setCurrentPosition] = useState<{latitude: number, longitude: number} | null>(null);
  const [scannedComponent, setScannedComponent] = useState<RailwayComponent | null>(null);
  const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false);


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

  const parseVCard = (vcard: string): Partial<Omit<RailwayComponent, 'currentState' | 'history'>> & { url?: string; currentState: ComponentState } => {
    const lines = vcard.split('\n');
    const data: any = {};
    lines.forEach(line => {
        const sanitizedLine = line.trim();
        if (sanitizedLine.startsWith('FN:')) {
            const fn = sanitizedLine.substring(3);
            const match = fn.match(/(.*) \((.*)\)/);
            if (match) {
                data.name = match[1].trim();
                data.id = match[2].trim();
            } else {
                data.name = fn.trim();
            }
        } else if (sanitizedLine.startsWith('CATEGORIES:')) {
            data.type = sanitizedLine.substring(11).trim();
        } else if (sanitizedLine.startsWith('URL:')) {
            data.url = sanitizedLine.substring(4).trim();
        } else if (sanitizedLine.startsWith('NOTE:')) {
            const notesText = sanitizedLine.substring(5);
            // Split by unescaped newlines, but handle escaped ones within a note
            const notes = notesText.split(/(?<!\\)\\n/g);
            notes.forEach(note => {
                const parts = note.split(': ');
                if (parts.length >= 2) {
                    const key = parts[0];
                    const value = parts.slice(1).join(': ').trim();
                    if (key === 'Location') data.location = value;
                    else if (key === 'Vendor') data.vendor = value;
                    else if (key === 'Install Date') data.installDate = new Date(value).toISOString();
                    else if (key === 'Warranty Until') data.warrantyUntil = new Date(value).toISOString();
                    else if (key === 'Supply Date') data.supplyDate = new Date(value).toISOString();
                } else if (note.includes('--MANUFACTURER--') || note.includes('--LAST INSPECTION--')) {
                    // This is a header, do nothing.
                }
            });
        }
    });
    data.currentState = 'Good'; // New components default to good
    return data;
  }

  const handleScan = useCallback(async (scannedData: string) => {
    if (!scanActive) return;
    setScanActive(false);
    toast({ title: "QR Code Found", description: "Processing..." });

    let componentId: string | undefined;
    let component: RailwayComponent | undefined | null = null;
    let isNewComponent = false;

    // 1. Try to parse as vCard for new components
    if (scannedData.startsWith('BEGIN:VCARD')) {
        const vcardData = parseVCard(scannedData);
        if (vcardData.id) {
            componentId = vcardData.id;
            component = await getComponentById(vcardData.id);
            if (!component) {
                const newComponentData: Omit<RailwayComponent, 'id' | 'geoPosition' > & {id: string} = {
                    id: vcardData.id!,
                    name: vcardData.name || 'Unknown',
                    type: vcardData.type || 'Unknown',
                    location: vcardData.location || 'Unknown',
                    vendor: vcardData.vendor || 'Unknown',
                    supplyDate: vcardData.supplyDate || new Date().toISOString(),
                    warrantyUntil: vcardData.warrantyUntil || new Date().toISOString(),
                    installDate: new Date().toISOString(),
                    currentState: 'Good',
                    qrCode: vcardData.url || `${window.location.origin}/components/${vcardData.id}`,
                    history: [],
                };
                if (currentPosition) {
                    (newComponentData as any).geoPosition = new GeoPoint(currentPosition.latitude, currentPosition.longitude);
                }
                
                await addComponent(newComponentData);
                component = await getComponentById(vcardData.id);
                isNewComponent = true;
                toast({
                    title: "New Component Registered",
                    description: `Component ${vcardData.id} has been added.`
                });
            }
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
             // Not a valid URL, do nothing
        }
    }

    // 3. Get component data and either show update dialog or navigate
    if (componentId) {
        if (!component) {
            component = await getComponentById(componentId);
        }

        if (component) {
             if (currentPosition) {
                await updateComponent(component.id, { 
                    geoPosition: new GeoPoint(currentPosition.latitude, currentPosition.longitude),
                    location: `Scanned at ${currentPosition.latitude.toFixed(4)}, ${currentPosition.longitude.toFixed(4)}`
                });
                component.geoPosition = new GeoPoint(currentPosition.latitude, currentPosition.longitude);
                component.location = `Scanned at ${currentPosition.latitude.toFixed(4)}, ${currentPosition.longitude.toFixed(4)}`;
            }

            if (!isNewComponent && user && (user.role === 'admin' || user.role === 'staff')) {
                setScannedComponent(component);
                setIsStatusUpdateOpen(true);
            } else {
                 toast({
                    title: "Scan Successful",
                    description: `Navigating to component ${componentId}...`
                });
                router.push(`/components/${componentId}`);
            }
        } else {
            toast({ variant: 'destructive', title: "Component Not Found" });
            setTimeout(() => setScanActive(true), 2000);
        }
    } else {
        toast({
            variant: 'destructive',
            title: "Invalid QR Code",
            description: "This QR code is not recognized. Please try again.",
        });
        setTimeout(() => setScanActive(true), 2000);
    }
  }, [getComponentById, addComponent, updateComponent, currentPosition, toast, router, user, scanActive]);

  const handleStatusUpdate = async (newStatus: ComponentState, notes: string) => {
    if (!scannedComponent || !user) return;

    const newInspection: Inspection = {
        id: `h-${scannedComponent.id}-${Date.now()}`,
        date: new Date().toISOString(),
        inspectorId: user.id,
        inspector: user.name,
        notes: notes,
        status: newStatus,
    };
    
    await updateComponent(scannedComponent.id, {
        currentState: newStatus,
        history: [...scannedComponent.history, newInspection],
    });
    
    toast({
        title: "Status Updated",
        description: `Component ${scannedComponent.name} status set to ${newStatus}.`
    });

    setIsStatusUpdateOpen(false);
    setScannedComponent(null);
    router.push(`/components/${scannedComponent.id}`);
  };

  const handleUpdateCancel = () => {
    if (scannedComponent) {
        router.push(`/components/${scannedComponent.id}`);
    }
    setIsStatusUpdateOpen(false);
    setScannedComponent(null);
  }


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

            if (code && code.data) {
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
  }, [scanActive, handleScan]);

  return (
    <>
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
                        <Alert variant="destructive">
                              <AlertTitle>Camera Access Required</AlertTitle>
                              <AlertDescription>
                                Please allow camera access to use this feature.
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

        {scannedComponent && (
            <UpdateStatusDialog
                isOpen={isStatusUpdateOpen}
                component={scannedComponent}
                onUpdate={handleStatusUpdate}
                onCancel={handleUpdateCancel}
            />
        )}
    </>
  );
}

    