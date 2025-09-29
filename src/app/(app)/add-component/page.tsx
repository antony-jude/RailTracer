
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { QrCode, Wand2, Download, FileType } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';

const componentSchema = z.object({
  id: z.string().min(3, { message: 'Component ID must be at least 3 characters.' }),
  name: z.string().min(3, { message: 'Component name is required.' }),
  type: z.string().min(3, { message: 'Component type is required.' }),
  location: z.string().min(3, { message: 'Location is required.' }),
  vendor: z.string().min(3, { message: 'Vendor is required.' }),
  warrantyUntil: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format.'}),
  supplyDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format.'}),
});

type ComponentFormValues = z.infer<typeof componentSchema>;

export default function AddComponentPage() {
    const { toast } = useToast();
    const [qrData, setQrData] = useState<string | null>(null);
    const [componentId, setComponentId] = useState<string | null>(null);

    const form = useForm<ComponentFormValues>({
        resolver: zodResolver(componentSchema),
        defaultValues: {
            id: '',
            name: '',
            type: '',
            location: '',
            vendor: '',
            warrantyUntil: new Date().toISOString().split('T')[0],
            supplyDate: new Date().toISOString().split('T')[0],
        },
    });

    const onSubmit = (data: ComponentFormValues) => {
        const qrCodeUrl = `${window.location.origin}/c/${data.id}`;
        
        const noteContent = [
            `Location:${data.location}`,
            `Vendor:${data.vendor}`,
            `Supply Date:${new Date(data.supplyDate).toLocaleDateString()}`,
            `Warranty Until:${new Date(data.warrantyUntil).toLocaleDateString()}`
        ].join('\\n');

        const vCardData = `
BEGIN:VCARD
VERSION:3.0
FN:${data.name} (${data.id})
ORG:RailTracer Component
CATEGORIES:${data.type}
NOTE;CHARSET=utf-8:${noteContent}
URL:${qrCodeUrl}
END:VCARD
        `.trim();
        
        setQrData(vCardData);
        setComponentId(data.id);
        toast({
            title: "QR Code Generated",
            description: `QR code for ${data.name} is ready to be downloaded.`
        });
    };
    
    const getQrCodeUrl = (format: 'png' | 'svg' = 'png') => {
        if (!qrData) return '';
        const base = 'https://api.qrserver.com/v1/create-qr-code/';
        const params = new URLSearchParams({
            data: qrData,
            size: '250x250',
            format: format,
            qzone: '1',
        });
        
        return `${base}?${params.toString()}`;
    }

    const downloadQrCode = (format: 'png' | 'svg') => {
        if (!qrData || !componentId) return;
        const url = getQrCodeUrl(format);
        
        saveAs(url, `component-${componentId}-qrcode.${format}`);
        
        toast({
            title: 'Download Started',
            description: `QR Code (${format.toUpperCase()}) is downloading.`
        });
    }


  return (
    <>
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Wand2 />
                    Create New Component & QR Code
                </CardTitle>
                <CardDescription>
                    Fill in the details for a new component to generate a corresponding QR code for tracking.
                </CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="id"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Component ID</FormLabel>
                                <FormControl><Input placeholder="e.g., WC-582-B" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Component Name</FormLabel>
                                <FormControl><Input placeholder="e.g., Wheelset Assembly B" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <FormControl><Input placeholder="e.g., Wheelset" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Initial Location</FormLabel>
                                <FormControl><Input placeholder="e.g., Warehouse 4" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="vendor"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vendor</FormLabel>
                                <FormControl><Input placeholder="e.g., RailTech Corp" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="supplyDate"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Supply Date</FormLabel>
                                <FormControl><Input type="date" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="warrantyUntil"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Warranty Until</FormLabel>
                                <FormControl><Input type="date" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    
                    <Button type="submit" className="w-full">
                        <QrCode className="mr-2 h-4 w-4" />
                        Generate QR Code
                    </Button>
                </form>
            </Form>
            
            {qrData && (
                <div className="mt-6 pt-6 border-t">
                    <h3 className="text-lg font-headline mb-4 text-center">QR Code Preview</h3>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <div className="p-4 bg-white rounded-lg border">
                           <Image src={getQrCodeUrl('png')} alt={`QR Code for ${componentId}`} width={200} height={200} />
                        </div>
                        <div className="flex flex-col gap-3">
                             <Button onClick={() => downloadQrCode('png')}>
                                <Download className="mr-2 h-4 w-4" />
                                Download PNG
                            </Button>
                            <Button variant="secondary" onClick={() => downloadQrCode('svg')}>
                                <FileType className="mr-2 h-4 w-4" />
                                Download SVG
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            </CardContent>
        </Card>
    </>
  );
}
