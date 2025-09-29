
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { RailwayComponent, ComponentState } from '@/lib/types';
import { Loader2 } from 'lucide-react';

const updateStatusSchema = z.object({
  status: z.enum(['Good', 'Poor', 'Needs Replacement'], { required_error: 'You must select a status.' }),
  notes: z.string().min(5, { message: 'Please provide a brief note (min. 5 characters).' }),
});

type UpdateStatusFormValues = z.infer<typeof updateStatusSchema>;

type UpdateStatusDialogProps = {
  isOpen: boolean;
  component: RailwayComponent;
  onUpdate: (newStatus: ComponentState, notes: string) => Promise<void>;
  onCancel: () => void;
};

export function UpdateStatusDialog({ isOpen, component, onUpdate, onCancel }: UpdateStatusDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UpdateStatusFormValues>({
    resolver: zodResolver(updateStatusSchema),
    defaultValues: {
      status: component.currentState,
      notes: '',
    },
  });

  const handleSubmit = async (data: UpdateStatusFormValues) => {
    setIsLoading(true);
    await onUpdate(data.status, data.notes);
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Status: {component.name}</DialogTitle>
          <DialogDescription>
            Scanned component <span className="font-semibold">{component.id}</span>. Set its current condition.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Component Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a new status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(['Good', 'Poor', 'Needs Replacement'] as ComponentState[]).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
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
                    <Textarea placeholder="e.g., Minor wear found on the flange." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Status
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
