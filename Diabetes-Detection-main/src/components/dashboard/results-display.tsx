"use client";

import { Lightbulb, Salad, CircleSlash, ShieldCheck, ShieldAlert, Cpu, Loader2, Download } from "lucide-react";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { PredictionResult, PredictionFormData } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ReportDocument } from "./report-document";
import { cn } from "@/lib/utils";

interface ResultsDisplayProps {
  result: PredictionResult | null;
  isLoading: boolean;
  formData: PredictionFormData | null;
}

export function ResultsDisplay({ result, isLoading, formData }: ResultsDisplayProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPdf(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: null });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "p", unit: "px", format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`DiaDetect_Report_${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (isLoading || !result || !formData) {
    return (
      <Card className="flex flex-col min-h-[400px]">
        <CardHeader>
          <CardTitle>Detection Results</CardTitle>
          <CardDescription>Machine Learning-powered assessment and personalized recommendations.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-center text-center text-muted-foreground">
          {isLoading ? (
            <div className="flex items-center gap-2 justify-center">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p className="font-medium">Running Detection...</p>
            </div>
          ) : (
            <>
              <p className="font-medium">Awaiting Detection</p>
              <p className="text-sm">Results will be displayed here after running a detection.</p>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  const isPositive = result.assessment === "Positive";
  const resultIcon = isPositive ? <ShieldAlert className="h-12 w-12 text-destructive" /> : <ShieldCheck className="h-12 w-12 text-green-500" />;

  return (
    <Card className="flex flex-col min-h-[400px] relative">
      {/* Hidden element for PDF generation */}
      <div className="absolute -z-10 -top-[9999px] -left-[9999px]">
        <div ref={reportRef} className="w-[800px] bg-white text-black">
          <ReportDocument result={result} formData={formData} />
        </div>
      </div>

      <CardHeader>
        <CardTitle>Detection Results</CardTitle>
        <CardDescription>Machine Learning-powered assessment and personalized recommendations.</CardDescription>
      </CardHeader>

      <CardContent className="flex-grow flex flex-col justify-center space-y-6 animate-in fade-in">
        <div className="flex flex-col items-center space-y-4 rounded-lg border bg-card p-6 shadow-inner">
          {resultIcon}
          <h3 className="text-2xl font-bold">
            Assessment: <span className={cn(isPositive ? "text-destructive" : "text-green-500")}>{result.assessment}</span>
          </h3>
          <p className="text-center text-sm text-muted-foreground">
            {isPositive
              ? "The model predicts a high risk of diabetes."
              : "The model predicts a low risk of diabetes."}
          </p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
            <Cpu className="h-4 w-4" /> Model: {result.model}
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="flex items-center gap-2 text-lg font-semibold text-primary">
            <Lightbulb className="h-5 w-5" /> Personalized Health Tips
          </h4>
          <p className="text-sm text-muted-foreground">{result.tips.healthTips}</p>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="flex items-center gap-2 text-lg font-semibold text-primary">
            <Salad className="h-5 w-5" /> Diet Recommendation
          </h4>
          <p className="text-sm text-muted-foreground">{result.tips.dietRecommendation}</p>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="flex items-center gap-2 text-lg font-semibold text-primary">
            <CircleSlash className="h-5 w-5" /> Daily Sugar Intake
          </h4>
          <p className="text-sm text-muted-foreground">{result.tips.sugarIntakeLimit}</p>
        </div>

        <Separator />

        <Button onClick={handleDownloadPdf} disabled={isGeneratingPdf} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          {isGeneratingPdf ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" /> Download Report
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
