import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

const portals = [
    {
        name: "UDM (User Depot Module)",
        description: "Official portal for Indian Railways e-Procurement System.",
        url: "https://www.ireps.gov.in",
    },
    {
        name: "TMS (Track Management System)",
        description: "Official portal for the Integrated Coaching Management System.",
        url: "https://www.irecept.gov.in",
    }
]

export default function ExternalPortalsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">External System Portals</CardTitle>
        <CardDescription>
            Links to external government systems for additional asset management and procurement information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {portals.map((portal) => (
            <Card key={portal.name} className="flex items-center justify-between p-4">
                <div>
                    <h3 className="font-semibold">{portal.name}</h3>
                    <p className="text-sm text-muted-foreground">{portal.description}</p>
                </div>
                <Button asChild variant="outline" size="sm">
                    <Link href={portal.url} target="_blank" rel="noopener noreferrer">
                        Visit Portal <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </Card>
        ))}
      </CardContent>
    </Card>
  );
}
