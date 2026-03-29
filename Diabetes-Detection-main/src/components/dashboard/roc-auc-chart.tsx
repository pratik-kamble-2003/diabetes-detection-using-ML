"use client"

import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartTooltipContent, ChartContainer, ChartConfig } from "@/components/ui/chart"

const chartData = [
  { fpr: 0.0, stacking: 0.0, extraTree: 0.0, lgbm: 0.0, catboost: 0.0, xgboost: 0.0 },
  { fpr: 0.1, stacking: 0.53, extraTree: 0.51, lgbm: 0.52, catboost: 0.50, xgboost: 0.515 },
  { fpr: 0.2, stacking: 0.75, extraTree: 0.73, lgbm: 0.74, catboost: 0.72, xgboost: 0.735 },
  { fpr: 0.3, stacking: 0.85, extraTree: 0.83, lgbm: 0.84, catboost: 0.82, xgboost: 0.835 },
  { fpr: 0.4, stacking: 0.90, extraTree: 0.88, lgbm: 0.89, catboost: 0.87, xgboost: 0.885 },
  { fpr: 0.5, stacking: 0.93, extraTree: 0.91, lgbm: 0.92, catboost: 0.90, xgboost: 0.915 },
  { fpr: 0.6, stacking: 0.95, extraTree: 0.94, lgbm: 0.945, catboost: 0.93, xgboost: 0.94 },
  { fpr: 0.7, stacking: 0.97, extraTree: 0.96, lgbm: 0.965, catboost: 0.95, xgboost: 0.96 },
  { fpr: 0.8, stacking: 0.98, extraTree: 0.975, lgbm: 0.98, catboost: 0.97, xgboost: 0.975 },
  { fpr: 0.9, stacking: 0.99, extraTree: 0.985, lgbm: 0.99, catboost: 0.98, xgboost: 0.985 },
  { fpr: 1.0, stacking: 1.0, extraTree: 1.0, lgbm: 1.0, catboost: 1.0, xgboost: 1.0 },
]

const chartConfig = {
  stacking: {
    label: "Stacking Classifier",
    color: "hsl(var(--chart-1))",
  },
  extraTree: {
    label: "Extra Tree",
    color: "hsl(var(--chart-2))",
  },
  lgbm: {
    label: "LGBM",
    color: "hsl(var(--chart-3))",
  },
  catboost: {
    label: "CatBoost",
    color: "hsl(var(--chart-4))",
  },
  xgboost: {
    label: "XGBoost",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function RocAucChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ROC-AUC Curve</CardTitle>
        <CardDescription>Receiver Operating Characteristic (ROC) curve for each model.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="fpr" 
                  type="number"
                  label={{ value: "False Positive Rate", position: "insideBottom", offset: -5 }}
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={8} 
                  fontSize={12} 
                />
                <YAxis 
                  label={{ value: "True Positive Rate", angle: -90, position: "insideLeft", offset: 10 }}
                  domain={[0, 1]}
                />
                <Tooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Legend content={({ payload }) => {
                    return (
                        <div className="flex justify-center items-center flex-wrap gap-4 mt-4">
                        {
                            payload?.map((entry, index) => (
                            <div key={`item-${index}`} className="flex items-center gap-2">
                                <div className="w-3 h-3" style={{backgroundColor: entry.color}}></div>
                                <span className="text-sm text-foreground">{chartConfig[entry.value as keyof typeof chartConfig]?.label}</span>
                            </div>
                            ))
                        }
                        </div>
                    )
                }} />
                <Line dataKey="stacking" type="monotone" stroke="var(--color-stacking)" strokeWidth={2} dot={false} />
                <Line dataKey="extraTree" type="monotone" stroke="var(--color-extraTree)" strokeWidth={2} dot={false} />
                <Line dataKey="lgbm" type="monotone" stroke="var(--color-lgbm)" strokeWidth={2} dot={false} />
                <Line dataKey="catboost" type="monotone" stroke="var(--color-catboost)" strokeWidth={2} dot={false} />
                <Line dataKey="xgboost" type="monotone" stroke="var(--color-xgboost)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
