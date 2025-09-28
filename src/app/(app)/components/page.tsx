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
import type { ComponentState } from '@/lib/types';
import { getComponents } from '@/lib/data';

const stateVariantMap: Record<ComponentState, "default" | "secondary" | "destructive"> = {
    Verified: 'default',
    Unverified: 'secondary',
    Damaged: 'destructive',
};

export default function ComponentsListPage() {
  const components = getComponents();

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Components</CardTitle>
        <CardDescription>A complete list of all tracked railway assets.</CardDescription>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {components.map((component) => (
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
