"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ConfusionMatrixProps {
  title: string
  data: {
    truePositive: number
    falseNegative: number
    falsePositive: number
    trueNegative: number
  }
}

function ConfusionMatrix({ title, data }: ConfusionMatrixProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <Table className="border rounded-lg overflow-hidden">
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead></TableHead>
            <TableHead className="text-center font-semibold text-foreground">Predicted Positive</TableHead>
            <TableHead className="text-center font-semibold text-foreground">Predicted Negative</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableHead className="font-semibold text-foreground">Actual Positive</TableHead>
            <TableCell className="text-center bg-green-500/20 text-green-500 font-bold">{data.truePositive}</TableCell>
            <TableCell className="text-center bg-red-500/20 text-red-500 font-bold">{data.falseNegative}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-semibold text-foreground">Actual Negative</TableHead>
            <TableCell className="text-center bg-red-500/20 text-red-500 font-bold">{data.falsePositive}</TableCell>
            <TableCell className="text-center bg-green-500/20 text-green-500 font-bold">{data.trueNegative}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

const matricesData = [
    {
        title: "Stacking Classifier",
        data: { truePositive: 130, falseNegative: 10, falsePositive: 5, trueNegative: 155 },
    },
    {
        title: "Extra Tree",
        data: { truePositive: 125, falseNegative: 15, falsePositive: 8, trueNegative: 152 },
    },
    {
        title: "LGBM",
        data: { truePositive: 128, falseNegative: 12, falsePositive: 6, trueNegative: 154 },
    },
    {
        title: "CatBoost",
        data: { truePositive: 129, falseNegative: 11, falsePositive: 7, trueNegative: 153 },
    },
    {
        title: "XGBoost",
        data: { truePositive: 127, falseNegative: 13, falsePositive: 7, trueNegative: 153 },
    },
]

export function ConfusionMatrices() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Confusion Matrices</CardTitle>
        <CardDescription>Comparison of confusion matrices for each model.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {matricesData.map((matrix) => (
            <ConfusionMatrix key={matrix.title} title={matrix.title} data={matrix.data} />
        ))}
      </CardContent>
    </Card>
  )
}
