import { getComponents } from '@/lib/data';
import { Wrench, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/metric-card';
import { ComponentStatusChart } from '@/components/dashboard/component-status-chart';
import { RecentInspectionsTable } from '@/components/dashboard/recent-inspections-table';

export default function DashboardPage() {
  const components = getComponents();
  const totalComponents = components.length;
  const verifiedCount = components.filter(c => c.currentState === 'Verified').length;
  const unverifiedCount = components.filter(c => c.currentState === 'Unverified').length;
  const damagedCount = components.filter(c => c.currentState === 'Damaged').length;

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
          title="Verified"
          value={verifiedCount}
          icon={CheckCircle}
          description="Components in good condition"
        />
        <MetricCard
          title="Unverified"
          value={unverifiedCount}
          icon={AlertTriangle}
          description="Components requiring inspection"
        />
        <MetricCard
          title="Damaged"
          value={damagedCount}
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
