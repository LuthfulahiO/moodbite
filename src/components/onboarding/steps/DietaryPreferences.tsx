import { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Fish, Egg, Wheat } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useFoodStore } from "@/store/food-store";
import { Button } from "@/components/ui/button";

const preferences = [
  { icon: Leaf, label: "Vegan", description: "Plant-based foods only" },
  { icon: Fish, label: "Pescatarian", description: "Fish and vegetables" },
  { icon: Egg, label: "Vegetarian", description: "No meat products" },
  { icon: Wheat, label: "Gluten-free", description: "No gluten products" },
];

interface DietaryPreferencesProps {
  onNext: () => void;
}

export function DietaryPreferences({ onNext }: DietaryPreferencesProps) {
  const { setDietaryPreferences } = useFoodStore();
  const [selected, setSelected] = useState<string[]>([]);

  const handlePreferencesChange = (preference: string) => {
    const newSelected = selected.includes(preference)
      ? selected.filter((p) => p !== preference)
      : [...selected, preference];
    setSelected(newSelected);
  };

  const handleSubmit = () => {
    setDietaryPreferences(selected);
    onNext();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Dietary Preferences
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {preferences.map((pref, index) => (
          <motion.div
            key={pref.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              onClick={() => handlePreferencesChange(pref.label)}
              className={`p-4 cursor-pointer hover:scale-[1.02] transition-all border-neutral-800
                        hover:border-primary/50 bg-neutral-900/50 backdrop-blur-sm
                        ${
                          selected.includes(pref.label)
                            ? "border-primary ring-2 ring-primary"
                            : ""
                        }`}
            >
              <div className="flex items-start space-x-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <pref.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{pref.label}</h3>
                  <p className="text-sm text-neutral-400">{pref.description}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      <Button
        onClick={handleSubmit}
        disabled={selected.length === 0}
        className="w-full bg-primary hover:bg-primary/90 mt-6"
      >
        Continue
      </Button>
    </div>
  );
}
