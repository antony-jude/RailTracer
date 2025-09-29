
"use client";

import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RailwayComponent, ComponentState } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import { useComponents } from '@/contexts/component-context';


const stateVariantMap: Record<ComponentState, "default" | "secondary" | "destructive"> = {
    'Good': 'default',
    'Poor': 'secondary',
    'Needs Replacement': 'destructive',
};

export function RecentInspectionsTable({ components }: { components: RailwayComponent[]}) {
  const recentInspections = components
    .flatMap(c => c.history.map(h => ({ ...h, componentId: c.id, componentName: c.name })))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
            <CardTitle className="font-headline">Recent Inspections</CardTitle>
            <CardDescription>A log of the latest inspection activities.</CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="/components">
            View All
            <ArrowUpRight className="h-4 w-4" />
            </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Component</TableHead>
              <TableHead className="hidden sm:table-cell">Inspector</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentInspections.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">No inspections yet.</TableCell>
                </TableRow>
            ) : (
                recentInspections.map((inspection) => (
                <TableRow key={inspection.id}>
                    <TableCell>
                    <Link href={`/components/${inspection.componentId}`} className="font-medium hover:underline">
                        {inspection.componentName}
                    </Link>
                    <div className="text-xs text-muted-foreground md:hidden">{new Date(inspection.date).toLocaleDateString()}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{inspection.inspector}</TableCell>
                    <TableCell className="hidden md:table-cell">{new Date(inspection.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                    <Badge variant={stateVariantMap[inspection.status]}>{inspection.status}</Badge>
                    </TableCell>
                </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
