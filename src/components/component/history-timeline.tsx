import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { RailwayComponent, ComponentState } from '@/lib/types';
import { getUserById } from '@/lib/data';
import { FileText } from 'lucide-react';

type HistoryTimelineProps = {
  component: RailwayComponent;
};

const stateVariantMap: Record<ComponentState, "default" | "secondary" | "destructive"> = {
    Verified: 'default',
    Unverified: 'secondary',
    Damaged: 'destructive',
};

const stateColorMap: Record<ComponentState, string> = {
    Verified: 'border-green-500',
    Unverified: 'border-yellow-500',
    Damaged: 'border-red-500',
};


export function HistoryTimeline({ component }: HistoryTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Component History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6 space-y-8">
            <div className="absolute left-[29px] top-2 bottom-2 w-0.5 bg-border -translate-x-1/2"></div>
            {component.history.map((item, index) => {
                const inspector = getUserById(item.inspectorId);
                const inspectorInitials = inspector?.name.split(' ').map(n => n[0]).join('') || '?';

                return (
                    <div key={item.id} className="relative flex gap-6">
                        <div className={`w-8 h-8 rounded-full bg-background flex-shrink-0 flex items-center justify-center border-2 ${stateColorMap[item.status]}`}>
                            <FileText className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <p className="font-medium">
                                    Inspection
                                    <span className="text-sm text-muted-foreground font-normal ml-2">{new Date(item.date).toLocaleDateString()}</span>
                                </p>
                                <Badge variant={stateVariantMap[item.status]}>{item.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <Avatar className="w-6 h-6">
                                    {inspector && <AvatarImage src={inspector.avatarUrl} alt={inspector.name} />}
                                    <AvatarFallback className="text-xs">{inspectorInitials}</AvatarFallback>
                                </Avatar>
                                <p className="text-xs text-muted-foreground">Inspected by {item.inspector}</p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
      </CardContent>
    </Card>
  );
}
