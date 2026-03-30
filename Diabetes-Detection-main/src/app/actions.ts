'use server';

import { generatePersonalizedHealthTips, type HealthTipsOutput } from '@/ai/flows/generate-personalized-health-tips';
import { answerDiabetesQuestions } from '@/ai/flows/answer-diabetes-questions-with-chatbot';
import { PredictionFormData, PredictionFormSchema, PredictionResult } from '@/lib/types';
import { z } from 'zod';

export async function predictDiabetesAction(
  data: PredictionFormData
): Promise<{ success: boolean; data: PredictionResult | null; error: string | null }> {
  const parsedData = PredictionFormSchema.safeParse(data);

  if (!parsedData.success) {
    return { success: false, data: null, error: 'Invalid input data.' };
  }

  try {
    // -----------------------------
    // 1️⃣ Call Flask backend for real model prediction
    // -----------------------------
    const response = await fetch("http://127.0.0.1:5001/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Pregnancies: parsedData.data.pregnancies,
        Glucose: parsedData.data.glucose,
        BloodPressure: parsedData.data.bloodPressure,
        SkinThickness: parsedData.data.skinThickness,
        Insulin: parsedData.data.insulin,
        BMI: parsedData.data.bmi,
        DiabetesPedigreeFunction: parsedData.data.diabetesPedigreeFunction,
        Age: parsedData.data.age,
        model: parsedData.data.model.toLowerCase().replace(" ", "_"),
      }),
    });

    const prediction = await response.json();

    if (!response.ok) {
      return { success: false, data: null, error: prediction.error || "Model prediction failed" };
    }

    // -----------------------------
    // 2️⃣ Prepare risk factors string (optional, used for tips)
    // -----------------------------
    const riskFactors = Object.entries(parsedData.data)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    // -----------------------------
    // 3️⃣ Generate health tips / recommendations
    // -----------------------------
    const healthTips: HealthTipsOutput = await generatePersonalizedHealthTips({
      riskFactors,
      assessmentResult: prediction.result,
    });

    // -----------------------------
    // 4️⃣ Return cleaned-up prediction result
    // -----------------------------
    const result: PredictionResult = {
      assessment: prediction.result,   // Positive / Negative
      tips: healthTips,
      model: parsedData.data.model,
    };

    return { success: true, data: result, error: null };
  } catch (e: any) {
    console.error(e);
    return { success: false, data: null, error: e.message || "Prediction failed" };
  }
}

// -----------------------------
// Chatbot for diabetes questions
// -----------------------------
const chatbotInput = z.object({
  question: z.string().min(1),
  diabetesRiskResult: z.string().optional(),
});

export async function askChatbotAction(
  data: z.infer<typeof chatbotInput>
): Promise<{ success: boolean; data: string | null; error: string | null }> {
  const parsedData = chatbotInput.safeParse(data);

  if (!parsedData.success) {
    return { success: false, data: null, error: 'Invalid question.' };
  }

  try {
    const response = await answerDiabetesQuestions(parsedData.data);
    return { success: true, data: response.answer, error: null };
  } catch (e) {
    console.error(e);
    return { success: false, data: null, error: 'The chatbot is currently unavailable. Please try again later.' };
  }
}
