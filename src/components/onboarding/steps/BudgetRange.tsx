import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useFoodStore } from "@/store/food-store";

interface BudgetRangeProps {
  onNext: () => void;
}

export function BudgetRange({ onNext }: BudgetRangeProps) {
  const { setBudgetRange } = useFoodStore();
  const [range, setRange] = useState([10, 50]);

  const handleSubmit = () => {
    setBudgetRange({
      min: range[0],
      max: range[1],
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">
        What&apos;s your typical meal budget?
      </h2>
      <div className="space-y-4">
        <Slider
          value={range}
          onValueChange={setRange}
          min={0}
          max={200}
          step={5}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-neutral-400">
          <span>${range[0]}</span>
          <span>${range[1]}</span>
        </div>
      </div>
      <Button
        onClick={handleSubmit}
        className="w-full bg-primary hover:bg-primary/90"
      >
        Continue
      </Button>
    </div>
  );
}
