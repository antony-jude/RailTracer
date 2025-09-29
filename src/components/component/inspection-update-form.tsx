
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FilePenLine, Loader2, Sparkles } from 'lucide-react';
import type { RailwayComponent, ComponentState, Inspection } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { MaterialStatusDetector } from '@/components/ai/material-status-detector';
import { AiSuggestionsDialog } from '@/components/ai/ai-suggestions-dialog';
import { suggestNextActions, SuggestNextActionsOutput } from '@/ai/flows/inspection-suggestions';
import { useToast } from '@/hooks/use-toast';
import { useComponents } from '@/contexts/component-context';

const inspectionSchema = z.object({
  notes: z.string().min(10, { message: 'Inspection notes must be at least 10 characters long.' }),
  status: z.enum(['Verified', 'Unverified', 'Damaged'], { required_error: 'You must select a status.' }),
});

type InspectionFormValues = z.infer<typeof inspectionSchema>;

type InspectionUpdateFormProps = {
  component: RailwayComponent;
};

export function InspectionUpdateForm({ component }: InspectionUpdateFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { updateComponent } = useComponents();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestionsDialog, setShowSuggestionsDialog] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<SuggestNextActionsOutput | null>(null);

  const form = useForm<InspectionFormValues>({
    resolver: zodResolver(inspectionSchema),
    defaultValues: {
      notes: '',
      status: component.currentState,
    },
  });

  const onSubmit = async (data: InspectionFormValues) => {
    if (!user) {
        toast({ title: "Not Authenticated", description: "You must be logged in to save an inspection.", variant: "destructive"});
        return;
    }

    setIsLoading(true);
    setAiSuggestions(null);

    const newInspection: Inspection = {
        id: `h-${component.id}-${Date.now()}`,
        date: new Date().toISOString(),
        inspectorId: user.id,
        inspector: user.name,
        notes: data.notes,
        status: data.status,
    };
    
    updateComponent(component.id, {
        currentState: data.status,
        history: [...component.history, newInspection],
    });

    try {
        const suggestions = await suggestNextActions({
            defectSeverity: data.status === 'Damaged' ? 'High' : (data.status === 'Unverified' ? 'Medium' : 'Low'),
            repairHistory: component.history.filter(h => h.status === 'Damaged').length > 0 ? 'Has prior repairs' : 'No prior repairs',
            componentType: component.type,
            inspectionNotes: data.notes,
        });
        setAiSuggestions(suggestions);
        setShowSuggestionsDialog(true);
    } catch (error) {
        console.error("AI suggestion error:", error);
        toast({
            variant: "destructive",
            title: "AI Error",
            description: "Could not get AI suggestions at this time.",
        })
    } finally {
        setIsLoading(false);
        form.reset();
        toast({
            title: "Inspection Saved",
            description: `Record for ${component.name} has been updated.`,
        });
    }
  };
  
  if (user?.role !== 'admin' && user?.role !== 'staff') {
    return null;
  }

  return (
    <>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <FilePenLine /> New Inspection Record
                </CardTitle>
                <CardDescription>
                    Update the component's status and add inspection notes.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a new status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {(['Verified', 'Unverified', 'Damaged'] as ComponentState[]).map(status => (
                                                <SelectItem key={status} value={status}>{status}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Inspection Notes</FormLabel>
                                <FormControl>
                                    <Textarea
                                    placeholder="Describe your findings, any repairs performed, and other relevant details..."
                                    rows={5}
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <Accordion type="single" collapsible>
                            <AccordionItem value="ai-tools">
                                <AccordionTrigger className="text-sm">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-accent" />
                                        <span>AI Assistant Tools</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-4">
                                    <MaterialStatusDetector />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Inspection
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
        <AiSuggestionsDialog
            isOpen={showSuggestionsDialog}
            onOpenChange={setShowSuggestionsDialog}
            suggestions={aiSuggestions}
        />
    </>
  );
}
