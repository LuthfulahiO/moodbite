"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingSteps } from "@/components/onboarding/OnboardingSteps";
import { MoodInput } from "@/components/mood-input/MoodInput";
import { useFoodStore } from "@/store/food-store";

export default function Home() {
  const { userPreferences } = useFoodStore();
  const hasCompletedOnboarding =
    userPreferences.dietaryPreferences.length > 0 &&
    userPreferences.healthRestrictions.length > 0 &&
    userPreferences.moodTracking.length > 0 &&
    userPreferences.budgetRange.max > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background">
      <div className="container mx-auto px-4 py-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="w-8 h-8 text-white" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-500 to-pink-500">
              MoodBite
            </h1>
          </div>
          <p className="text-neutral-400 text-lg mb-8">
            Discover food that matches your mood, powered by AI
          </p>
          {!hasCompletedOnboarding && (
            <Button
              variant="secondary"
              className="text-sm hover:scale-105 transition-transform"
            >
              Skip for now
            </Button>
          )}
        </motion.div>

        {hasCompletedOnboarding ? <MoodInput /> : <OnboardingSteps />}
      </div>
    </div>
  );
}
