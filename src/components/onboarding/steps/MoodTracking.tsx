import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useFoodStore } from "@/store/food-store";
import { Button } from "@/components/ui/button";

const moods = [
  { emoji: "😊", label: "Happy", color: "bg-yellow-500/10" },
  { emoji: "😌", label: "Relaxed", color: "bg-blue-500/10" },
  { emoji: "🤔", label: "Thoughtful", color: "bg-purple-500/10" },
  { emoji: "😴", label: "Tired", color: "bg-gray-500/10" },
  { emoji: "🥳", label: "Celebratory", color: "bg-pink-500/10" },
];

interface MoodTrackingProps {
  onNext: () => void;
}

export function MoodTracking({ onNext }: MoodTrackingProps) {
  const { setMoodTracking } = useFoodStore();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleSubmit = () => {
    if (selectedMood) {
      setMoodTracking([selectedMood]);
      onNext();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-white mb-6">
        How are you feeling right now?
      </h2>
      <div className="flex flex-wrap gap-4">
        {moods.map((mood, index) => (
          <motion.div
            key={mood.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              className={`p-4 cursor-pointer transition-all
                         border-neutral-800 ${
                           selectedMood === mood.label
                             ? "border-primary ring-2 ring-primary"
                             : "hover:border-primary/50"
                         } ${mood.color}
                         backdrop-blur-sm flex flex-col items-center gap-2`}
              onClick={() => setSelectedMood(mood.label)}
            >
              <span className="text-4xl">{mood.emoji}</span>
              <span className="text-sm text-neutral-300">{mood.label}</span>
            </Card>
          </motion.div>
        ))}
      </div>
      <Button
        onClick={handleSubmit}
        disabled={!selectedMood}
        className="w-full bg-primary hover:bg-primary/90 mt-6"
      >
        Continue
      </Button>
    </div>
  );
}
