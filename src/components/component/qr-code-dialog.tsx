
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from 'next/image';
import type { RailwayComponent } from '@/lib/types';
import { Button } from "../ui/button";
import { Download, FileType } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type QrCodeDialogProps = {
  component: RailwayComponent | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function QrCodeDialog({ component, isOpen, onOpenChange }: QrCodeDialogProps) {
  const { toast } = useToast();

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
NOTE;CHARSET=utf-8:Location: ${component.location}\\nStatus: ${component.currentState}\\nInstall Date: ${new Date(component.installDate).toLocaleDateString()}\\n--MANUFACTURER--\\nVendor: ${component.vendor}\\nSupply Date: ${new Date(component.supplyDate).toLocaleDateString()}\\nWarranty Until: ${new Date(component.warrantyUntil).toLocaleDateString()}\\n--LAST INSPECTION--\\nDate: ${lastInspection ? new Date(lastInspection.date).toLocaleDateString() : 'N/A'}\\nInspector: ${lastInspection ? lastInspection.inspector : 'N/A'}\\nStatus: ${lastInspection ? lastInspection.status : 'N/A'}\\nNotes: ${lastInspection ? lastInspection.notes.replace(/(\\r)?\\n/g, ' ') : 'N/A'}
URL:${component.qrCode}
END:VCARD
  `.trim();

  const getQrCodeUrl = (format: 'png' | 'svg' = 'png', forDisplay = true) => {
    const base = 'https://api.qr-code-generator.com/v1/create';
    const params = new URLSearchParams({
        'qr-code-text': qrData,
        'image-format': format.toUpperCase(),
        'font-name': 'Roboto',
        'marker-center-template': 'circle',
        'marker-left-template': 'circle',
        'marker-right-template': 'circle',
        'qr-code-logo': 'scan-me-square'
    });
     if (!forDisplay) {
        params.set('download', '1');
    }
    return `${base}?${params.toString()}`;
  }

  const downloadQrCode = (format: 'png' | 'svg') => {
      if (!qrData || !component.id) return;
      const url = getQrCodeUrl(format, false);
      try {
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `component-${component.id}-qrcode.${format}`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          toast({
              title: 'Download Started',
              description: `QR Code (${format.toUpperCase()}) is downloading.`
          })
      } catch (error) {
          console.error('Failed to download QR code:', error);
          toast({
              variant: 'destructive',
              title: 'Download Failed',
              description: 'Could not download the QR code. Please try again.'
          })
      }
  }


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Component QR Code</DialogTitle>
          <DialogDescription>
            Scan this code to view detailed component information. This data is embedded in the code for offline use.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-4 bg-white rounded-lg">
          <Image src={getQrCodeUrl('png')} alt={`QR Code for ${component.id}`} width={250} height={250} />
        </div>
        <DialogFooter className="sm:justify-center gap-2">
            <Button onClick={() => downloadQrCode('png')} size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download PNG
            </Button>
            <Button variant="secondary" onClick={() => downloadQrCode('svg')} size="sm">
                <FileType className="mr-2 h-4 w-4" />
                Download SVG
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    