import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { DietaryPreferences } from "./steps/DietaryPreferences";
import { MoodTracking } from "./steps/MoodTracking";

export function OnboardingSteps() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="backdrop-blur-xl bg-neutral-900/50 border-neutral-800 p-8">
        <div className="space-y-8">
          <DietaryPreferences />
          <MoodTracking />
        </div>
      </Card>
    </motion.div>
  );
}
