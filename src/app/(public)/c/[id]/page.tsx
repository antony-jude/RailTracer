
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { RailwayComponent, ComponentState } from "@/lib/types";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, MapPin, Calendar, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const toISOStringSafe = (timestamp: Timestamp | undefined | null | string): string => {
    if (!timestamp) return new Date().toISOString();
    if (typeof timestamp === 'string') return timestamp;
    if (timestamp && typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toISOString();
    }
    return new Date().toISOString();
};

const getComponentById = async (id: string): Promise<RailwayComponent | undefined> => {
    const docRef = doc(db, 'components', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            ...data,
            id: docSnap.id,
            installDate: toISOStringSafe(data.installDate),
            supplyDate: toISOStringSafe(data.supplyDate),
            warrantyUntil: toISOStringSafe(data.warrantyUntil),
             history: data.history?.map((h: any) => ({
              ...h,
              date: toISOStringSafe(h.date)
            })) || []
        } as RailwayComponent;
    }
    return undefined;
};

const stateVariantMap: Record<ComponentState, "default" | "secondary" | "destructive"> = {
    'Good': 'default',
    'Poor': 'secondary',
    'Needs Replacement': 'destructive',
};

const stateInfoMap: Record<ComponentState, { color: string, icon: React.FC<any> }> = {
    'Good': { color: 'bg-green-500', icon: CheckCircle },
    'Poor': { color: 'bg-yellow-500', icon: AlertTriangle },
    'Needs Replacement': { color: 'bg-red-500', icon: XCircle },
};


export default async function PublicComponentPage({ params }: { params: { id: string } }) {
  const component = await getComponentById(params.id);

  if (!component) {
    notFound();
  }

  const StatusIcon = stateInfoMap[component.currentState].icon;
  const statusColor = stateInfoMap[component.currentState].color;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
       <div className="w-full max-w-2xl mx-auto">
         <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path fill="hsl(var(--primary))" d="M 80,15 C 85,15 90,20 90,25 L 90,75 C 90,80 85,85 80,85 L 20,85 C 15,85 10,80 10,75 L 10,25 C 10,20 15,15 20,15 Z M 50,25 L 25,50 L 50,75 L 75,50 Z" />
                </svg>
            </div>
            <h1 className="text-2xl font-headline">RailTracer</h1>
        </div>
        <Card>
            <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-muted-foreground">{component.id}</p>
                    <CardTitle className="font-headline text-2xl">{component.name}</CardTitle>
                </div>
                <Badge variant={stateVariantMap[component.currentState]} className="text-sm">
                    <StatusIcon className={`w-4 h-4 mr-2`} />
                    {component.currentState}
                </Badge>
            </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 text-sm">
                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                    <Wrench className="w-5 h-5 text-primary" />
                    <div>
                        <p className="font-semibold">Type</p>
                        <p>{component.type}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                        <p className="font-semibold">Location</p>
                        <p>{component.location}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                        <p className="font-semibold">Install Date</p>
                        <p>{new Date(component.installDate).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{backgroundColor: `hsl(var(--${stateVariantMap[component.currentState] === 'default' ? 'primary' : stateVariantMap[component.currentState]}) / 0.1)`}}>
                    <StatusIcon className={`w-5 h-5 text-${stateVariantMap[component.currentState] === 'default' ? 'primary' : stateVariantMap[component.currentState]}`} />
                    <div>
                        <p className="font-semibold">Current Status</p>
                        <p>{component.currentState}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
        <p className="text-center text-xs text-muted-foreground mt-4">This is a public, read-only view of the component data.</p>
       </div>
    </div>
  );
}
