import { getComponentById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ComponentDetails } from '@/components/component/component-details';
import { HistoryTimeline } from '@/components/component/history-timeline';
import { InspectionUpdateForm } from '@/components/component/inspection-update-form';

type ComponentPageProps = {
  params: {
    id: string;
  };
};

export default function ComponentPage({ params }: ComponentPageProps) {
  const component = getComponentById(params.id);

  if (!component) {
    notFound();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <ComponentDetails component={component} />
            <HistoryTimeline component={component} />
        </div>
        <div className="lg:col-span-1">
            <div className="sticky top-20">
                <InspectionUpdateForm component={component} />
            </div>
        </div>
    </div>
  );
}
