import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useFoodStore } from "@/store/food-store";
import { Input } from "@/components/ui/input";

interface BudgetRangeProps {
  onNext: () => void;
}

export function BudgetRange({ onNext }: BudgetRangeProps) {
  const { setBudgetRange } = useFoodStore();
  const [budget, setBudget] = useState({
    min: "10",
    max: "50"
  });
  const [error, setError] = useState("");

  const handleChange = (field: 'min' | 'max', value: string) => {
    // Only allow numbers and empty string
    if (value === '' || /^\d+$/.test(value)) {
      setBudget(prev => ({ ...prev, [field]: value }));
      setError("");
    }
  };

  const handleSubmit = () => {
    const min = Number(budget.min);
    const max = Number(budget.max);

    if (min > max) {
      setError("Minimum budget cannot be greater than maximum budget");
      return;
    }

    if (min < 0 || max < 0) {
      setError("Budget values cannot be negative");
      return;
    }

    setBudgetRange({
      min,
      max,
    });
    onNext();
  };

  const isValid = 
    budget.min !== "" && 
    budget.max !== "" && 
    Number(budget.min) >= 0 && 
    Number(budget.max) >= Number(budget.min);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">
        What&apos;s your typical meal budget?
      </h2>
      <p className="text-sm text-muted-foreground">
        Enter your minimum and maximum budget per meal
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="min-budget" className="text-sm text-muted-foreground">
            Minimum ($)
          </label>
          <Input
            id="min-budget"
            type="text"
            value={budget.min}
            onChange={(e) => handleChange('min', e.target.value)}
            placeholder="0"
            className="bg-secondary/50"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="max-budget" className="text-sm text-muted-foreground">
            Maximum ($)
          </label>
          <Input
            id="max-budget"
            type="text"
            value={budget.max}
            onChange={(e) => handleChange('max', e.target.value)}
            placeholder="100"
            className="bg-secondary/50"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!isValid}
        className="w-full"
      >
        Continue
      </Button>
    </div>
  );
}
