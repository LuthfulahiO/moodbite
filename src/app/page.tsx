"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingSteps } from "@/components/onboarding/OnboardingSteps";
import { MoodInput } from "@/components/mood-input/MoodInput";
import { usePreferences } from "./store/preference";

export default function Home() {
  const { preferences } = usePreferences();
  const hasCompletedOnboarding = Object.values(preferences).some(
    (pref) => pref.length > 0
  );

  console.log(preferences);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      <div className="container mx-auto px-4 py-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
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

        {!hasCompletedOnboarding ? <MoodInput /> : <OnboardingSteps />}
      </div>
    </div>
  );
}
