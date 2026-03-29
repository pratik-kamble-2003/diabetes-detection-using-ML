"use client"
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { ConfusionMatrices } from "@/components/dashboard/confusion-matrices";
import { RocAucChart } from "@/components/dashboard/roc-auc-chart";

export default function AnalyticsPage() {
    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-white">
            <div className="container mx-auto space-y-6">
                <PerformanceChart />
                <RocAucChart />
                <ConfusionMatrices />
            </div>
        </main>
    )
}
