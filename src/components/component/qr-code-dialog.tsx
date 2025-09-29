
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from 'next/image';
import type { RailwayComponent } from '@/lib/types';

type QrCodeDialogProps = {
  component: RailwayComponent | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function QrCodeDialog({ component, isOpen, onOpenChange }: QrCodeDialogProps) {
  if (!component) {
    return null;
  }

  const sortedHistory = component.history?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const lastInspection = sortedHistory?.length > 0 ? sortedHistory[0] : null;

  const qrData = `
BEGIN:VCARD
VERSION:3.0
FN:${component.name} (${component.id})
ORG:RailTracer Component
CATEGORIES:${component.type}
NOTE;CHARSET=utf-8:Location: ${component.location}\\nStatus: ${component.currentState}\\nInstall Date: ${new Date(component.installDate).toLocaleDateString()}\\n--MANUFACTURER--\\nVendor: ${component.vendor}\\nSupply Date: ${new Date(component.supplyDate).toLocaleDateString()}\\nWarranty Until: ${new Date(component.warrantyUntil).toLocaleDateString()}\\n--LAST INSPECTION--\\nDate: ${lastInspection ? new Date(lastInspection.date).toLocaleDateString() : 'N/A'}\\nInspector: ${lastInspection ? lastInspection.inspector : 'N/A'}\\nStatus: ${lastInspection ? lastInspection.status : 'N/A'}\\nNotes: ${lastInspection ? lastInspection.notes.replace(/\\n/g, ' ') : 'N/A'}
URL:${component.qrCode}
END:VCARD
  `.trim();

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>Component QR Code</DialogTitle>
          <DialogDescription>
            Scan this code to view detailed component information. This data is embedded in the code for offline use.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-4 bg-white rounded-lg">
          <Image src={qrCodeUrl} alt={`QR Code for ${component.id}`} width={250} height={250} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
