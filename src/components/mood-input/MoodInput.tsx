import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function MoodInput() {
  const [mood, setMood] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood.trim()) return;

    //call API and handle response
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
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
          disabled={!mood.trim()}
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
    </motion.div>
  );
}
