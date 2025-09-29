import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { SuggestNextActionsOutput } from "@/ai/flows/inspection-suggestions";
import { Lightbulb } from "lucide-react";

type AiSuggestionsDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  suggestions: SuggestNextActionsOutput | null;
};

export function AiSuggestionsDialog({ isOpen, onOpenChange, suggestions }: AiSuggestionsDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline flex items-center gap-2">
            <Lightbulb className="text-primary" />
            AI-Generated Suggestions
          </AlertDialogTitle>
          <AlertDialogDescription>
            Based on the inspection details, here are the recommended next actions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {suggestions && (
            <div className="text-sm space-y-4 py-4">
                <div>
                    <h4 className="font-semibold mb-2">Next Actions:</h4>
                    <ul className="list-disc list-inside space-y-1">
                        {suggestions.nextActions.map((action, index) => (
                            <li key={index}>{action}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Reasoning:</h4>
                    <p className="text-muted-foreground">{suggestions.reasoning}</p>
                </div>
            </div>
        )}
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => onOpenChange(false)}>Got it</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
