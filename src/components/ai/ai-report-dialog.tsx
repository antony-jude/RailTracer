import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';

type AiReportDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  report: string | null;
  isLoading: boolean;
};

export function AiReportDialog({ isOpen, onOpenChange, report, isLoading }: AiReportDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline flex items-center gap-2">
            <FileText className="text-primary" />
            AI-Generated Component Report
          </AlertDialogTitle>
          <AlertDialogDescription>
            An AI-generated summary and analysis of the component's data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <ScrollArea className="h-96 w-full rounded-md border p-4">
            {isLoading && (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="ml-4 text-muted-foreground">Generating report...</p>
                </div>
            )}
            {report && (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{report}</ReactMarkdown>
                </div>
            )}
        </ScrollArea>
        
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => onOpenChange(false)}>Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
