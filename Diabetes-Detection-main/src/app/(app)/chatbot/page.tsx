"use client"
import { useState } from "react"
import { Chatbot } from "@/components/dashboard/chatbot"
import { PredictionResult } from "@/lib/types"

export default function ChatbotPage() {
    const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);

    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto">
                <Chatbot predictionResult={predictionResult} />
            </div>
        </main>
    )
}
