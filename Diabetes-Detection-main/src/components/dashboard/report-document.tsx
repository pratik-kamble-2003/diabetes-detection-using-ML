"use client";

import { PredictionFormData, PredictionResult } from "@/lib/types";
import { HeartPulse, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportDocumentProps {
    result: PredictionResult;
    formData: PredictionFormData;
}

export function ReportDocument({ result, formData }: ReportDocumentProps) {
    const isPositive = result.assessment === 'Positive';

    const inputData = [
        { label: "Pregnancies", value: formData.pregnancies },
        { label: "Glucose", value: formData.glucose },
        { label: "Blood Pressure", value: formData.bloodPressure },
        { label: "Skin Thickness", value: formData.skinThickness },
        { label: "Insulin", value: formData.insulin },
        { label: "BMI", value: formData.bmi },
        { label: "Diabetes Pedigree", value: formData.diabetesPedigreeFunction },
        { label: "Age", value: formData.age },
    ];

    return (
        <div className="p-10 font-sans bg-white text-black">
            <header className="flex items-center justify-between pb-6 border-b-2 border-gray-200">
                <div className="flex items-center gap-3">
                    <XCircle className="h-10 w-10 text-primary" />
                    <h1 className="text-4xl font-bold text-gray-800">DiaDetect</h1>
                </div>
                <div className="text-right">
                    <p className="text-lg font-semibold text-gray-700">Health Report</p>
                    <p className="text-sm text-gray-500">Generated on: {new Date().toLocaleDateString()}</p>
                </div>
            </header>

            <main className="mt-8">
                <section className="mb-8 p-6 bg-gray-50 rounded-lg">
                    <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">Assessment Summary</h2>
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "p-3 rounded-full",
                            isPositive ? "bg-red-100" : "bg-green-100"
                        )}>
                            <p className={cn(
                                "text-3xl font-bold",
                                isPositive ? "text-red-600" : "text-green-600"
                            )}>
                                {result.assessment}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600">
                                The model predicts a {isPositive ? "high" : "low"} risk of diabetes.
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Prediction performed using the <strong>{result.model}</strong> model.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">Personalized Recommendations</h2>
                    <div className="space-y-4 text-gray-700">
                        <div>
                            <h3 className="font-semibold text-lg mb-1 text-indigo-700">Health Tips</h3>
                            <p>{result.tips.healthTips}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-1 text-indigo-700">Diet Recommendation</h3>
                            <p>{result.tips.dietRecommendation}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-1 text-indigo-700">Daily Sugar Intake</h3>
                            <p>{result.tips.sugarIntakeLimit}</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">Input Data</h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        {inputData.map(item => (
                            <div key={item.label} className="flex justify-between border-b py-2">
                                <span className="font-medium text-gray-600">{item.label}:</span>
                                <span className="font-mono text-gray-800">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <footer className="mt-10 pt-4 text-center text-xs text-gray-400 border-t">
                <p>This report is generated based on a machine learning model and should not be considered a substitute for professional medical advice. Consult with a healthcare provider for any health concerns.</p>
                <p className="mt-1">&copy; {new Date().getFullYear()} DiaDetect. All rights reserved.</p>
            </footer>
        </div>
    );
}
