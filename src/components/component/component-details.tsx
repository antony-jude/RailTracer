import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { RailwayComponent, ComponentState } from '@/lib/types';
import { Calendar, MapPin, QrCode, Wrench, ShieldCheck, Building, Truck } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '../ui/button';

type ComponentDetailsProps = {
  component: RailwayComponent;
  onGenerateReport: () => void;
  isReportLoading: boolean;
};

const stateVariantMap: Record<ComponentState, "default" | "secondary" | "destructive"> = {
    Verified: 'default',
    Unverified: 'secondary',
    Damaged: 'destructive',
};

const stateColorMap: Record<ComponentState, string> = {
    Verified: 'bg-green-500',
    Unverified: 'bg-yellow-500',
    Damaged: 'bg-red-500',
};

export function ComponentDetails({ component }: ComponentDetailsProps) {
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(component.qrCode)}`;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-2xl">{component.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{component.id}</p>
            </div>
            <Badge variant={stateVariantMap[component.currentState]} className="text-sm">
                <span className={`w-2 h-2 rounded-full mr-2 ${stateColorMap[component.currentState]}`}></span>
                {component.currentState}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="flex items-center gap-3">
          <Wrench className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Type</p>
            <p className="font-medium">{component.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-medium">{component.location}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Install Date</p>
            <p className="font-medium">{new Date(component.installDate).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Truck className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Supply Date</p>
            <p className="font-medium">{new Date(component.supplyDate).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Building className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Vendor</p>
            <p className="font-medium">{component.vendor}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Warranty</p>
            <p className="font-medium">Until {new Date(component.warrantyUntil).toLocaleDateString()}</p>
          </div>
        </div>
         <div className="flex items-start gap-3 md:col-span-2">
            <QrCode className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
            <div className="space-y-2">
                 <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <QrCode className="mr-2 h-4 w-4" />
                            Show QR Code
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xs">
                        <DialogHeader>
                        <DialogTitle>Component QR Code</DialogTitle>
                        <DialogDescription>
                            Scan this code with any mobile device to access component details.
                        </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center justify-center p-4 bg-white rounded-lg">
                        <Image src={qrCodeUrl} alt={`QR Code for ${component.id}`} width={250} height={250} />
                        </div>
                    </DialogContent>
                </Dialog>
                <p className="text-xs text-muted-foreground break-all">{component.qrCode}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
