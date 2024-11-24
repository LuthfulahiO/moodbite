import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

const moods = [
  { emoji: '😊', label: 'Happy', color: 'bg-yellow-500/10' },
  { emoji: '😌', label: 'Relaxed', color: 'bg-blue-500/10' },
  { emoji: '🤔', label: 'Thoughtful', color: 'bg-purple-500/10' },
  { emoji: '😴', label: 'Tired', color: 'bg-gray-500/10' },
  { emoji: '🥳', label: 'Celebratory', color: 'bg-pink-500/10' },
];

export function MoodTracking() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-white mb-6">
        How would you like to track your mood?
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
              className={`p-4 cursor-pointer hover:scale-[1.02] transition-all
                         border-neutral-800 hover:border-primary/50 ${mood.color}
                         backdrop-blur-sm flex flex-col items-center gap-2`}
            >
              <span className="text-4xl">{mood.emoji}</span>
              <span className="text-sm text-neutral-300">{mood.label}</span>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}