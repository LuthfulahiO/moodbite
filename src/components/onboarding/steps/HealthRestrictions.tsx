import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useFoodStore } from "@/store/food-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";

export function HealthRestrictions({ onNext }: { onNext: () => void }) {
  const { setHealthRestrictions } = useFoodStore();
  const [preferences, setPreferences] = useState("");

  const handleSubmit = () => {
    // Split by commas, newlines, or semicolons and clean up the entries
    const preferencesList = preferences
      .split(/[,;\n]/)
      .map((pref) => pref.trim())
      .filter((pref) => pref.length > 0);

    setHealthRestrictions(preferencesList);
    onNext();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-white mb-2">
        Health Restrictions
      </h2>
      <p className="text-neutral-400 text-sm mb-4 flex items-center gap-2">
        <Info className="w-4 h-4" />
        Tell us about your health restrictions
      </p>
      <Card className="p-4 border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
        <Textarea
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          placeholder="Example:
- I'm allergic to peanuts and shellfish
- I'm trying to reduce dairy intake
- I have celiac disease
- I prefer plant-based meals
- I'm following a low-sodium diet"
          className="min-h-[200px] bg-transparent border-neutral-800 focus:border-primary"
        />
      </Card>
      <Button
        onClick={handleSubmit}
        disabled={preferences.trim().length === 0}
        className="w-full bg-primary hover:bg-primary/90 mt-6"
      >
        Continue
      </Button>
    </div>
  );
}
