
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { QrCode, Wand2 } from 'lucide-react';
import { QrCodeDialog } from '@/components/component/qr-code-dialog';
import type { RailwayComponent } from '@/lib/types';
import { useComponents } from '@/contexts/component-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

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
    const router = useRouter();
    const { toast } = useToast();
    const { addComponent } = useComponents();
    const [generatedComponent, setGeneratedComponent] = useState<RailwayComponent | null>(null);

    const form = useForm<ComponentFormValues>({
        resolver: zodResolver(componentSchema),
        defaultValues: {
            id: '',
            name: '',
            type: '',
            location: '',
            vendor: '',
            warrantyUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString().split('T')[0],
            supplyDate: new Date().toISOString().split('T')[0],
        },
    });

    const onSubmit = (data: ComponentFormValues) => {
        const newComponent: RailwayComponent = {
        ...data,
        installDate: new Date().toISOString().split('T')[0],
        currentState: 'Unverified',
        qrCode: `${window.location.origin}/components/${data.id}`,
        history: [],
        };
        addComponent(newComponent);
        setGeneratedComponent(newComponent);
        toast({
            title: "Component Created",
            description: `QR code for ${newComponent.name} is ready.`
        })
    };

    const navigateToComponents = () => {
        if(generatedComponent) {
            router.push('/components');
        }
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
            </CardContent>
        </Card>
         <QrCodeDialog 
            component={generatedComponent}
            isOpen={!!generatedComponent}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setGeneratedComponent(null);
                    navigateToComponents();
                }
            }}
        />
    </>
  );
}
