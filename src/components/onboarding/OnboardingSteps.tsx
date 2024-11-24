import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { DietaryPreferences } from "./steps/DietaryPreferences";
import { MoodTracking } from "./steps/MoodTracking";
import { HealthRestrictions } from "./steps/HealthRestrictions";
import { Nationality } from "./steps/Nationality";

const steps = [
  { id: "dietary", component: DietaryPreferences },
  { id: "health", component: HealthRestrictions },
  { id: "nationality", component: Nationality },
  { id: "mood", component: MoodTracking },
];

export function OnboardingSteps() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      console.log("Onboarding completed!");
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="backdrop-blur-xl bg-neutral-900/50 border-neutral-800 p-8">
        <div className="space-y-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-neutral-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 w-8 rounded-full transition-colors duration-300 ${
                    index <= currentStep ? "bg-primary" : "bg-neutral-700"
                  }`}
                />
              ))}
            </div>
          </div>
          <CurrentStepComponent onNext={handleNext} />
        </div>
      </Card>
    </motion.div>
  );
}
