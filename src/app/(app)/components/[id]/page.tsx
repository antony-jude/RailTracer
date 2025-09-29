
"use client";

import { useState, use, useEffect } from 'react';
import { useComponents } from '@/contexts/component-context';
import { notFound } from 'next/navigation';
import { ComponentDetails } from '@/components/component/component-details';
import { HistoryTimeline } from '@/components/component/history-timeline';
import { InspectionUpdateForm } from '@/components/component/inspection-update-form';
import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';
import { generateComponentReport } from '@/ai/flows/component-report-generation';
import { AiReportDialog } from '@/components/ai/ai-report-dialog';
import { useToast } from '@/hooks/use-toast';
import type { RailwayComponent } from '@/lib/types';

type ComponentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function ComponentPage({ params }: ComponentPageProps) {
  const { toast } = useToast();
  const { id } = use(params);
  const { getComponentById } = useComponents();
  const [component, setComponent] = useState<RailwayComponent | null | undefined>(undefined);

  const [isReportLoading, setIsReportLoading] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  
  useEffect(() => {
    const foundComponent = getComponentById(id);
    setComponent(foundComponent);
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


  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
              <ComponentDetails 
                component={component}
                onGenerateReport={handleGenerateReport}
                isReportLoading={isReportLoading}
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
