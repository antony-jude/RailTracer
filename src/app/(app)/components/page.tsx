
"use client";

import { useState } from 'react';
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
import type { ComponentState, RailwayComponent } from '@/lib/types';
import { useComponents } from '@/contexts/component-context';
import { Button } from '@/components/ui/button';
import { PlusCircle, QrCode } from 'lucide-react';
import { QrCodeDialog } from '@/components/component/qr-code-dialog';

const stateVariantMap: Record<ComponentState, "default" | "secondary" | "destructive"> = {
    Verified: 'default',
    Unverified: 'secondary',
    Damaged: 'destructive',
};

export default function ComponentsListPage() {
  const { components } = useComponents();
  const [selectedComponent, setSelectedComponent] = useState<RailwayComponent | null>(null);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>All Components</CardTitle>
                <CardDescription>A complete list of all tracked railway assets.</CardDescription>
            </div>
             <Button asChild>
                <Link href="/add-component">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Component
                </Link>
            </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {components.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">No components found.</TableCell>
                </TableRow>
              ) : (
                components.map((component) => (
                    <TableRow key={component.id}>
                    <TableCell>
                        <Link href={`/components/${component.id}`} className="font-medium text-primary hover:underline">
                        {component.id}
                        </Link>
                    </TableCell>
                    <TableCell>{component.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">{component.type}</TableCell>
                    <TableCell className="hidden md:table-cell">{component.location}</TableCell>
                    <TableCell>
                        <Badge variant={stateVariantMap[component.currentState]}>{component.currentState}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <Button variant="outline" size="icon" onClick={() => setSelectedComponent(component)}>
                            <QrCode className="h-4 w-4" />
                            <span className="sr-only">Show QR Code</span>
                        </Button>
                    </TableCell>
                    </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <QrCodeDialog 
        component={selectedComponent}
        isOpen={!!selectedComponent}
        onOpenChange={(isOpen) => {
            if (!isOpen) {
                setSelectedComponent(null);
            }
        }}
      />
    </>
  );
}

