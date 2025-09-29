
"use client";

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useComponents } from '@/contexts/component-context';
import { useAuth } from '@/hooks/use-auth';
import { notFound } from 'next/navigation';
import { ComponentDetails } from '@/components/component/component-details';
import { HistoryTimeline } from '@/components/component/history-timeline';
import { InspectionUpdateForm } from '@/components/component/inspection-update-form';
import { Button } from '@/components/ui/button';
import { FileText, Loader2, Trash2 } from 'lucide-react';
import { generateComponentReport } from '@/ai/flows/component-report-generation';
import { AiReportDialog } from '@/components/ai/ai-report-dialog';
import { useToast } from '@/hooks/use-toast';
import type { RailwayComponent } from '@/lib/types';
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

type ComponentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function ComponentPage({ params }: ComponentPageProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const { id } = use(params);
  const { getComponentById, deleteComponent } = useComponents();
  const [component, setComponent] = useState<RailwayComponent | null | undefined>(undefined);

  const [isReportLoading, setIsReportLoading] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchComponent = async () => {
        const foundComponent = await getComponentById(id);
        setComponent(foundComponent);
    }
    fetchComponent();
  }, [id, getComponentById]);

  if (component === undefined) {
      return <div className="flex h-full items-center justify-center">Loading component...</div>
  }

  if (!component) {
    notFound();
  }

  const handleGenerateReport = async () => {
    setAiReport(null);
    setShowReportDialog(true);
    setIsReportLoading(true);
    try {
      const result = await generateComponentReport({ component });
      setAiReport(result.report);
    } catch (error) {
      console.error('AI report error:', error);
      toast({
        variant: 'destructive',
        title: 'AI Report Error',
        description: 'Could not generate AI report at this time.',
      });
      setShowReportDialog(false);
    } finally {
      setIsReportLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!component) return;
    try {
      await deleteComponent(component.id);
      toast({
        title: "Component Deleted",
        description: `Component ${component.name} has been successfully removed.`,
      });
      router.push('/components');
    } catch (error) {
      console.error('Delete component error:', error);
      toast({
        variant: 'destructive',
        title: 'Delete Error',
        description: 'Could not delete the component at this time.',
      });
    }
  };


  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
              <ComponentDetails 
                component={component}
              />
              <HistoryTimeline component={component} />
          </div>
          <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-4">
                  <Button onClick={handleGenerateReport} disabled={isReportLoading} className="w-full">
                      {isReportLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                          <FileText className="mr-2 h-4 w-4" />
                      )}
                      Generate AI Report
                  </Button>
                  
                  {user?.role === 'admin' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Component
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            component and all of its associated history.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                            Yes, delete component
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  
                  <InspectionUpdateForm component={component} />
              </div>
          </div>
      </div>
      <AiReportDialog
        isOpen={showReportDialog}
        onOpenChange={setShowReportDialog}
        report={aiReport}
        isLoading={isReportLoading}
      />
    </>
  );
}
