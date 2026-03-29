"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartTooltipContent, ChartTooltip, ChartContainer, ChartConfig } from "@/components/ui/chart"

const chartData = [
  { model: "Sta", accuracy: 94, fill: "hsl(var(--chart-1))" },
  { model: "Ext", accuracy: 92, fill: "hsl(var(--chart-2))" },
  { model: "LGB", accuracy: 93, fill: "hsl(var(--chart-3))" },
  { model: "Cat", accuracy: 93.5, fill: "hsl(var(--chart-4))" },
  { model: "XGB", accuracy: 92.5, fill: "hsl(var(--chart-5))" },
]

const chartConfig = {
  accuracy: {
    label: "Accuracy (%)",
  },
  Sta: {
    label: "Stacking",
    color: "hsl(var(--chart-1))",
  },
  Ext: {
    label: "Extra Tree",
    color: "hsl(var(--chart-2))",
  },
  LGB: {
    label: "LightGBM",
    color: "hsl(var(--chart-3))",
  },
  Cat: {
    label: "CatBoost",
    color: "hsl(var(--chart-4))",
  },
  XGB: {
    label: "XGBoost",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function PerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Accuracy</CardTitle>
        <CardDescription>Comparison of accuracy scores across different models.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
            <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="model" tickLine={false} axisLine={true} tickMargin={8} fontSize={12} stroke="hsl(var(--foreground))" />
              <YAxis domain={[85, 100]} tickFormatter={(value) => `${value}%`} stroke="hsl(var(--foreground))" />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" hideLabel />}
              />
              <Bar dataKey="accuracy" radius={[8, 8, 8, 8]}>
                {chartData.map((entry) => (
                  <rect key={entry.model} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
