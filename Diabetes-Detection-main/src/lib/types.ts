import { z } from "zod";

export const PredictionFormSchema = z.object({
  pregnancies: z.coerce.number().int().min(0, "Must be 0 or more").max(20, "Invalid value"),
  glucose: z.coerce.number().min(0, "Cannot be negative").max(300, "Invalid value"),
  bloodPressure: z.coerce.number().min(0, "Cannot be negative").max(200, "Invalid value"),
  skinThickness: z.coerce.number().min(0, "Cannot be negative").max(100, "Invalid value"),
  insulin: z.coerce.number().min(0, "Cannot be negative").max(1000, "Invalid value"),
  bmi: z.coerce.number().min(0, "Cannot be negative").max(100, "Invalid value"),
  diabetesPedigreeFunction: z.coerce.number().min(0, "Cannot be negative").max(3, "Invalid value"),
  age: z.coerce.number().int().min(1, "Must be 1 or older").max(120, "Invalid value"),
  model: z.enum(["Stacking", "Extra Tree", "LightGBM", "CatBoost", "XGBoost"]),
});

export type PredictionFormData = z.infer<typeof PredictionFormSchema>;

export type HealthTips = {
  healthTips: string;
  dietRecommendation: string;
  sugarIntakeLimit: string;
};

export type PredictionResult = {
  assessment: 'Positive' | 'Negative';
  tips: HealthTips;
  model: string;
};

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
}
