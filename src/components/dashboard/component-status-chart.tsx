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
    { name: 'Verified', total: statusCounts.Verified || 0, fill: 'var(--color-verified)' },
    { name: 'Unverified', total: statusCounts.Unverified || 0, fill: 'var(--color-unverified)' },
    { name: 'Damaged', total: statusCounts.Damaged || 0, fill: 'var(--color-damaged)' },
  ];
  
  const chartConfig = {
    total: {
      label: "Total",
    },
    verified: {
      label: "Verified",
      color: "hsl(var(--chart-4))",
    },
    unverified: {
      label: "Unverified",
      color: "hsl(var(--chart-2))",
    },
    damaged: {
      label: "Damaged",
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
            --color-verified: ${chartConfig.verified.color};
            --color-unverified: ${chartConfig.unverified.color};
            --color-damaged: ${chartConfig.damaged.color};
          }
          .dark {
            --color-verified: ${chartConfig.verified.color};
            --color-unverified: ${chartConfig.unverified.color};
            --color-damaged: ${chartConfig.damaged.color};
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
