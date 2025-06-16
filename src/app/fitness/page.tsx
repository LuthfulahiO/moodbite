"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Recommendation {
  name: string;
  description: string;
  macros: {
    protein: string;
    carbs: string;
    fats: string;
    calories: string;
  };
  ingredients: string[];
  preparation: string;
  mealTiming: string;
  fitnessBenefits: string[];
}

interface Analysis {
  fitnessGoals: string[];
  nutritionalNeeds: {
    protein: string;
    carbs: string;
    fats: string;
    calories: string;
  };
  dietaryContext: {
    mealType: string;
    timing: string;
    restrictions: string[];
  };
}

interface ApiResponse {
  analysis: Analysis;
  recommendations: Recommendation[];
  explanation: string;
}

export default function FitnessPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/fitness", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        throw new Error("Failed to get recommendations");
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <Dumbbell className="w-8 h-8 text-white" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-500 to-pink-500">
              Fitness Fuel
            </h1>
          </div>
          <p className="text-neutral-400 text-lg mb-8">
            Get personalized meal recommendations for your fitness goals
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="mb-12">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your fitness goals and dietary needs... (e.g., 'I need a high protein meal for bulking that's low in fat. I prefer chicken and I'm working out in the evening.')"
            className="min-h-[120px] mb-4"
          />
          <Button
            type="submit"
            disabled={loading || query.length < 10}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Recommendations...
              </>
            ) : (
              "Get Recommendations"
            )}
          </Button>
        </form>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Analysis</CardTitle>
                <CardDescription>
                  Your fitness and nutritional needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Fitness Goals</h3>
                    <div className="flex flex-wrap gap-2">
                      {response.analysis.fitnessGoals.map((goal, index) => (
                        <span
                          key={index}
                          className="bg-purple-500/10 text-purple-500 px-3 py-1 rounded-full text-sm"
                        >
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Nutritional Needs</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(response.analysis.nutritionalNeeds).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="bg-neutral-800/50 p-3 rounded-lg"
                          >
                            <div className="text-sm text-neutral-400">
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </div>
                            <div className="font-medium">{value}</div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {response.recommendations.map((recommendation, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{recommendation.name}</CardTitle>
                    <CardDescription>
                      {recommendation.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Macros</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(recommendation.macros).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="bg-neutral-800/50 p-3 rounded-lg"
                              >
                                <div className="text-sm text-neutral-400">
                                  {key.charAt(0).toUpperCase() + key.slice(1)}
                                </div>
                                <div className="font-medium">{value}</div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Ingredients</h3>
                        <div className="flex flex-wrap gap-2">
                          {recommendation.ingredients.map((ingredient, idx) => (
                            <span
                              key={idx}
                              className="bg-neutral-800/50 px-3 py-1 rounded-full text-sm"
                            >
                              {ingredient}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Preparation</h3>
                        <p className="text-neutral-400">
                          {recommendation.preparation}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Meal Timing</h3>
                        <p className="text-neutral-400">
                          {recommendation.mealTiming}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Fitness Benefits</h3>
                        <div className="flex flex-wrap gap-2">
                          {recommendation.fitnessBenefits.map(
                            (benefit, idx) => (
                              <span
                                key={idx}
                                className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm"
                              >
                                {benefit}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Explanation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-400">{response.explanation}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
