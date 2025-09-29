
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { RailwayComponent } from '@/lib/types';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

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
    { name: 'Needs Replacement', total: statusCounts['Needs Replacement'] || 0, fill: 'var(--color-needs-replacement)' },
  ];
  
  const chartConfig = {
    total: {
      label: "Total",
    },
    good: {
      label: "Good",
      color: "hsl(var(--chart-2))",
    },
    poor: {
      label: "Poor",
      color: "hsl(var(--chart-3))",
    },
    "needs-replacement": {
      label: "Needs Replacement",
      color: "hsl(var(--destructive))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Component Status Overview</CardTitle>
        <CardDescription>A bar chart showing the health of all components.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                />
                <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                allowDecimals={false}
                />
                <Tooltip
                    cursor={{fill: 'hsl(var(--muted))'}}
                    content={<ChartTooltipContent />}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
