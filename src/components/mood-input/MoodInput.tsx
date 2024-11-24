import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Check, BookmarkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useFoodStore } from "@/store/food-store";
import { toast } from "sonner";

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
  const { userPreferences, addSelectedRecommendation, resetPreferences } =
    useFoodStore();

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
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error("Error getting recommendations:", error);
      toast.error("Failed to get recommendations. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const handleSelectRecommendation = (recommendation: Recommendation) => {
    setSelectedId(recommendation.name);
  };

  const handleSaveRecommendation = () => {
    if (!selectedId) return;

    const selectedRecommendation = recommendations.find(
      (rec) => rec.name === selectedId
    );

    if (selectedRecommendation) {
      addSelectedRecommendation(mood, selectedRecommendation);
      toast.success("Recommendation saved!");
    }
  };

  const handleResetPreferences = () => {
    resetPreferences();
    setMood("");
    setRecommendations([]);
    setSelectedId(null);
    toast.success("Preferences have been reset");
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
          placeholder="Example: I am craving something sweet and comforting, maybe something from italy but not too heavy."
          className="min-h-[100px] bg-secondary/50 border-border 
                   focus:border-primary/50 backdrop-blur-sm"
        />
        <Button
          type="submit"
          disabled={!mood.trim() || isPending}
          className="w-full"
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
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recommended for your mood</h2>
            {selectedId && (
              <Button
                onClick={handleSaveRecommendation}
                variant="secondary"
                size="sm"
                className="flex items-center gap-2"
              >
                <BookmarkIcon className="w-4 h-4" />
                Save Selection
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Select a recommendation and click save to store it:
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
                      : "border-border bg-secondary/50 hover:border-primary/50"
                  }`}
                onClick={() => handleSelectRecommendation(rec)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-white mb-2">{rec.name}</h3>
                    <p className="text-sm text-neutral-400">
                      {rec.description}
                    </p>
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
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={handleResetPreferences}
          className="text-destructive hover:text-destructive"
        >
          Reset all preferences
        </Button>
      </div>
    </motion.div>
  );
}
