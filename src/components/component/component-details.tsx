import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { RailwayComponent, ComponentState } from '@/lib/types';
import { Calendar, MapPin, QrCode, Wrench, ShieldCheck, Building, Truck } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
         <div className="flex items-center gap-3">
          <QrCode className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">QR Code</p>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <a href={component.qrCode} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline block max-w-full truncate">
                            {component.qrCode}
                        </a>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>View QR Code data</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
