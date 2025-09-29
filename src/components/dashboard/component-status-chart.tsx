
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RailwayComponent } from '@/lib/types';

type ComponentStatusChartProps = {
  components: RailwayComponent[];
};

export function ComponentStatusChart({ components }: ComponentStatusChartProps) {
  const statusCounts = components.reduce(
    (acc, component) => {
      acc[component.currentState] = (acc[component.currentState] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const chartData = [
    { name: 'Good', total: statusCounts.Good || 0, fill: 'var(--color-good)' },
    { name: 'Poor', total: statusCounts.Poor || 0, fill: 'var(--color-poor)' },
    { name: 'Needs Replace', total: statusCounts['Needs Replacement'] || 0, fill: 'var(--color-needs-replacement)' },
  ];
  
  const chartConfig = {
    total: {
      label: "Total",
    },
    good: {
      label: "Good",
      color: "hsl(var(--chart-4))",
    },
    poor: {
      label: "Poor",
      color: "hsl(var(--chart-2))",
    },
    "needs-replacement": {
      label: "Needs Replacement",
      color: "hsl(var(--chart-3))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Component Status</CardTitle>
      </CardHeader>
      <CardContent>
        <style>
          {`
          :root {
            --color-good: ${chartConfig.good.color};
            --color-poor: ${chartConfig.poor.color};
            --color-needs-replacement: ${chartConfig['needs-replacement'].color};
          }
          .dark {
            --color-good: ${chartConfig.good.color};
            --color-poor: ${chartConfig.poor.color};
            --color-needs-replacement: ${chartConfig['needs-replacement'].color};
          }
          `}
        </style>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
             <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              allowDecimals={false}
            />
            <Tooltip
                cursor={{fill: 'hsla(var(--muted))'}}
                contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))'}}
            />
            <Bar dataKey="total" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
