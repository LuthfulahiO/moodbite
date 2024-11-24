import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFoodStore } from "@/store/food-store";

export function CuisinePreferences({ onNext }: { onNext: () => void }) {
  const [cuisinePreference, setCuisinePreference] = useState("");
  const updatePreferences = useFoodStore((state) => state.updatePreferences);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences({ cuisinePreference });
    onNext();
  };

  const handleSkip = () => {
    updatePreferences({ cuisinePreference: "" });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Any specific cuisine in mind?</h2>
          <p className="text-neutral-400">
            Tell us if you&apos;re craving something specific (optional)
          </p>
        </div>
        <Input
          placeholder="e.g., Italian, Japanese, Mexican..."
          value={cuisinePreference}
          onChange={(e) => setCuisinePreference(e.target.value)}
          className="bg-neutral-800/50"
        />
      </div>
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleSkip}
          className="flex-1"
        >
          Skip
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={!cuisinePreference.trim()}
        >
          Continue
        </Button>
      </div>
    </form>
  );
}
