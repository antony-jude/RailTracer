
"use client";

import { useComponents } from '@/contexts/component-context';
import { Wrench, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/metric-card';
import { ComponentStatusChart } from '@/components/dashboard/component-status-chart';
import { RecentInspectionsTable } from '@/components/dashboard/recent-inspections-table';

export default function DashboardPage() {
  const { components } = useComponents();
  const totalComponents = components.length;
  const goodCount = components.filter(c => c.currentState === 'Good').length;
  const poorCount = components.filter(c => c.currentState === 'Poor').length;
  const needsReplacementCount = components.filter(c => c.currentState === 'Needs Replacement').length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Components"
          value={totalComponents}
          icon={Wrench}
          description="Total assets being tracked"
        />
        <MetricCard
          title="Good"
          value={goodCount}
          icon={CheckCircle}
          description="Components in good condition"
        />
        <MetricCard
          title="Poor"
          value={poorCount}
          icon={AlertTriangle}
          description="Components requiring inspection"
        />
        <MetricCard
          title="Needs Replacement"
          value={needsReplacementCount}
          icon={XCircle}
          description="Components needing repair"
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <ComponentStatusChart components={components} />
        </div>
        <div className="lg:col-span-3">
          <RecentInspectionsTable components={components} />
        </div>
      </div>
    </div>
  );
}
