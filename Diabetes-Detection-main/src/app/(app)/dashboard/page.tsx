"use client"
import { useState } from "react";
import { PredictionForm } from "@/components/dashboard/prediction-form";
import { ResultsDisplay } from "@/components/dashboard/results-display";
import type { PredictionFormData, PredictionResult } from "@/lib/types";

export default function DashboardPage() {
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [formData, setFormData] = useState<PredictionFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePrediction = (result: PredictionResult, data: PredictionFormData) => {
    setPredictionResult(result);
    setFormData(data);
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto max-w-4xl space-y-6">
            <PredictionForm 
              onResult={handlePrediction} 
              onLoading={setIsLoading}
              isLoading={isLoading}
            />
            { (isLoading || predictionResult) && 
              <ResultsDisplay result={predictionResult} isLoading={isLoading} formData={formData} />
            }
        </div>
      </main>
    </div>
  );
}
