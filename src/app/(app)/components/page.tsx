
"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ComponentState, RailwayComponent } from '@/lib/types';
import { useComponents } from '@/contexts/component-context';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { PlusCircle, QrCode, Loader2, Trash2 } from 'lucide-react';
import { QrCodeDialog } from '@/components/component/qr-code-dialog';
import { useToast } from '@/hooks/use-toast';

const stateVariantMap: Record<ComponentState, "default" | "secondary" | "destructive"> = {
    'Good': 'default',
    'Poor': 'secondary',
    'Needs Replacement': 'destructive',
};

export default function ComponentsListPage() {
  const { user } = useAuth();
  const { components, loading, deleteComponent } = useComponents();
  const { toast } = useToast();
  const [selectedComponent, setSelectedComponent] = useState<RailwayComponent | null>(null);
  const [componentToDelete, setComponentToDelete] = useState<RailwayComponent | null>(null);

  const handleDelete = async () => {
    if (!componentToDelete) return;
    try {
      await deleteComponent(componentToDelete.id);
      toast({
        title: "Component Deleted",
        description: `Component ${componentToDelete.name} has been removed.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Failed to delete component.",
      });
    } finally {
      setComponentToDelete(null);
    }
  };


  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="font-headline">All Components</CardTitle>
                <CardDescription>A complete list of all tracked railway assets.</CardDescription>
            </div>
             <Button asChild>
                <Link href="/add-component">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Component
                </Link>
            </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                        <div className="flex justify-center items-center">
                            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                            <span>Loading components...</span>
                        </div>
                    </TableCell>
                </TableRow>
              ) : components.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">No components found.</TableCell>
                </TableRow>
              ) : (
                components.map((component) => (
                    <TableRow key={component.id}>
                    <TableCell>
                        <Link href={`/components/${component.id}`} className="font-medium text-primary hover:underline">
                        {component.id}
                        </Link>
                    </TableCell>
                    <TableCell>{component.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">{component.type}</TableCell>
                    <TableCell className="hidden md:table-cell">{component.location}</TableCell>
                    <TableCell>
                        <Badge variant={stateVariantMap[component.currentState]}>{component.currentState}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="icon" onClick={() => setSelectedComponent(component)}>
                            <QrCode className="h-4 w-4" />
                            <span className="sr-only">Show QR Code</span>
                        </Button>
                        {user?.role === 'admin' && (
                           <Button variant="destructive" size="icon" onClick={() => setComponentToDelete(component)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete Component</span>
                            </Button>
                        )}
                    </TableCell>
                    </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <QrCodeDialog 
        component={selectedComponent}
        isOpen={!!selectedComponent}
        onOpenChange={(isOpen) => {
            if (!isOpen) {
                setSelectedComponent(null);
            }
        }}
      />
      <AlertDialog open={!!componentToDelete} onOpenChange={(isOpen) => !isOpen && setComponentToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the component 
                <span className="font-semibold"> {componentToDelete?.name} ({componentToDelete?.id})</span>.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                Yes, delete
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
