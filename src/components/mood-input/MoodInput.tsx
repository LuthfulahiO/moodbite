import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useFoodStore } from "@/store/food-store";

interface Recommendation {
  name: string;
  cuisine: string;
  description: string;
  matchScore: number;
  moodAlignment: string;
  dietaryTags: string[];
  nutritionalBenefits: string[];
}

export function MoodInput() {
  const [mood, setMood] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { userPreferences, addSelectedRecommendation } = useFoodStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood.trim()) return;

    setIsPending(true);
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mood: mood.trim(),
          preferences: userPreferences,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get recommendations");
      }

      const data = await response.json();
      console.log(data);
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error("Error getting recommendations:", error);
      // Handle error appropriately
    } finally {
      setIsPending(false);
    }
  };

  const handleSelectRecommendation = (recommendation: Recommendation) => {
    setSelectedId(recommendation.name);
    addSelectedRecommendation(mood, recommendation);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto space-y-8"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="How are you feeling? (e.g., 'I'm stressed and craving comfort food')"
          className="min-h-[100px] bg-neutral-900/50 border-neutral-800 
                   focus:border-primary/50 backdrop-blur-sm"
        />
        <Button
          type="submit"
          disabled={!mood.trim() || isPending}
          className="w-full bg-primary hover:bg-primary/90 text-white"
        >
          {isPending ? (
            "Analyzing your mood..."
          ) : (
            <span className="flex items-center gap-2">
              Get Recommendations
              <Send className="w-4 h-4" />
            </span>
          )}
        </Button>
      </form>

      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold text-white">
            Recommended for your mood
          </h2>
          <p className="text-sm text-neutral-400 mb-4">
            Select the recommendation you'd like to try:
          </p>
          <div className="grid gap-4">
            {recommendations.map((rec) => (
              <motion.div
                key={rec.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border cursor-pointer transition-colors
                  ${
                    selectedId === rec.name
                      ? "border-primary bg-primary/10"
                      : "border-neutral-800 bg-neutral-900/50 hover:border-primary/50"
                  }`}
                onClick={() => handleSelectRecommendation(rec)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-white mb-2">{rec.name}</h3>
                    <p className="text-sm text-neutral-400">{rec.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {rec.dietaryTags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded-full bg-neutral-800 text-neutral-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {selectedId === rec.name && (
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
