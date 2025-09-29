
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
  
  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/c/${component.id}`;

  const vCardData = `
BEGIN:VCARD
VERSION:3.0
FN:${component.name} (${component.id})
ORG:RailTracer Component
CATEGORIES:${component.type}
NOTE;CHARSET=utf-8:Location: ${component.location}\\nStatus: ${component.currentState}
URL:${publicUrl}
END:VCARD
  `.trim();

  const getQrCodeUrl = (format: 'png' | 'svg' = 'png') => {
    const base = 'https://api.qrserver.com/v1/create-qr-code/';
    const params = new URLSearchParams({
        data: vCardData,
        size: '250x250',
        format: format,
        qzone: '1',
    });
    return `${base}?${params.toString()}`;
  }

  const downloadQrCode = (format: 'png' | 'svg') => {
      if (!vCardData || !component.id) return;
      const url = getQrCodeUrl(format);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `component-${component.id}-qrcode.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
          title: 'Download Started',
          description: `QR Code (${format.toUpperCase()}) is downloading.`
      })
  }


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Component QR Code</DialogTitle>
          <DialogDescription>
            Scan this code to view component information.
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
