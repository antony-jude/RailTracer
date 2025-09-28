import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RailwayComponent, ComponentState } from '@/lib/types';
import { Calendar, MapPin, QrCode, Wrench } from 'lucide-react';

type ComponentDetailsProps = {
  component: RailwayComponent;
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
          <QrCode className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">QR Code</p>
            <p className="font-medium">{component.qrCode}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
