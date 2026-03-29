"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Baby, Droplets, Heart, Ruler, TestTube, Scale, Star, User, Wand, Loader2, FileBox } from "lucide-react";
import React from "react";

import type { PredictionFormData, PredictionResult } from "@/lib/types";
import { PredictionFormSchema } from "@/lib/types";
import { predictDiabetesAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PredictionFormProps {
  onResult: (result: PredictionResult, data: PredictionFormData) => void;
  onLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const models = ["Stacking", "Extra Tree", "LightGBM", "CatBoost", "XGBoost"];

export function PredictionForm({ onResult, onLoading, isLoading }: PredictionFormProps) {
  const { toast } = useToast();
  const form = useForm<PredictionFormData>({
    resolver: zodResolver(PredictionFormSchema),
    defaultValues: {
      pregnancies: 0,
      glucose: 120,
      bloodPressure: 80,
      skinThickness: 20,
      insulin: 80,
      bmi: 25,
      diabetesPedigreeFunction: 0.5,
      age: 30,
      model: "Stacking",
    },
  });

  async function onSubmit(data: PredictionFormData) {
    onLoading(true);
    const result = await predictDiabetesAction(data);
    onLoading(false);

    if (result.success && result.data) {
      onResult(result.data, data);
      toast({
        title: "Detection Complete",
        description: `Results from ${result.data.model} model are now displayed.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Detection Failed",
        description: result.error || "An unknown error occurred.",
      });
    }
  }

  const formFields: { name: keyof Omit<PredictionFormData, "model">; label: string; icon: React.ReactNode }[] = [
    { name: "pregnancies", label: "Pregnancies", icon: <Baby className="w-4 h-4 text-muted-foreground" /> },
    { name: "glucose", label: "Glucose", icon: <Droplets className="w-4 h-4 text-muted-foreground" /> },
    { name: "bloodPressure", label: "Blood Pressure", icon: <Heart className="w-4 h-4 text-muted-foreground" /> },
    { name: "skinThickness", label: "Skin Thickness", icon: <Ruler className="w-4 h-4 text-muted-foreground" /> },
    { name: "insulin", label: "Insulin", icon: <TestTube className="w-4 h-4 text-muted-foreground" /> },
    { name: "bmi", label: "BMI", icon: <Scale className="w-4 h-4 text-muted-foreground" /> },
    { name: "diabetesPedigreeFunction", label: "Diabetes Pedigree", icon: <Star className="w-4 h-4 text-muted-foreground" /> },
    { name: "age", label: "Age", icon: <User className="w-4 h-4 text-muted-foreground" /> },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Health Data Input</CardTitle>
        <CardDescription>Enter patient data to detect diabetes likelihood.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-4">
            {formFields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      {field.icon} {field.label}
                    </FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...formField} className="bg-gray-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <div className="md:col-span-4">
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileBox className="w-4 h-4 text-muted-foreground" /> Select Model
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-gray-100">
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {models.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-4 mt-4">
            <Button type="submit" disabled={isLoading} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Detecting...
                </>
              ) : (
                <>
                  <Wand className="mr-2 h-4 w-4" />
                  Detect
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
