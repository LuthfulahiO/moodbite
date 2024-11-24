import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Meal {
  id: string;
  name: string;
  description: string;
  moodMatch: string;
  weatherContext?: string;
  timeContext?: string;
  savedAt?: Date;
}

export interface Recommendation {
  name: string;
  cuisine: string;
  description: string;
  matchScore: number;
  moodAlignment: string;
  dietaryTags: string[];
  nutritionalBenefits: string[];
}

interface FoodStore {
  savedMeals: {
    id: string;
    name: string;
    timestamp: Date;
    mood: string;
    context: {
      weather: string;
      timeOfDay: string;
      location?: string;
    };
  }[];
  userPreferences: {
    dietaryPreferences: string[];
    healthRestrictions: string[];
    moodTracking: string[];
    budgetRange: { min: number; max: number };
  };
  selectedRecommendations: {
    recommendation: Recommendation;
    mood: string;
    selectedAt: Date;
  }[];
  addSavedMeal: (meal: Meal) => void;
  removeSavedMeal: (id: string) => void;
  updatePreferences: (
    preferences: Partial<FoodStore["userPreferences"]>
  ) => void;
  setDietaryPreferences: (preferences: string[]) => void;
  setHealthRestrictions: (restrictions: string[]) => void;
  setMoodTracking: (moods: string[]) => void;
  setBudgetRange: (budget: { min: number; max: number }) => void;
  addSelectedRecommendation: (
    mood: string,
    recommendation: Recommendation
  ) => void;
}

export const useFoodStore = create<FoodStore>()(
  persist(
    (set) => ({
      savedMeals: [],
      userPreferences: {
        dietaryPreferences: [],
        healthRestrictions: [],
        moodTracking: [],
        budgetRange: { min: 0, max: 0 },
      },
      selectedRecommendations: [],
      addSavedMeal: (meal) =>
        set((state) => ({
          savedMeals: [
            ...state.savedMeals,
            {
              id: meal.id,
              name: meal.name,
              timestamp: new Date(),
              mood: meal.moodMatch,
              context: {
                weather: meal.weatherContext || "",
                timeOfDay: meal.timeContext || "",
              },
            },
          ],
        })),
      removeSavedMeal: (id) =>
        set((state) => ({
          savedMeals: state.savedMeals.filter((meal) => meal.id !== id),
        })),
      updatePreferences: (preferences) =>
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            ...preferences,
          },
        })),
      setDietaryPreferences: (preferences) =>
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            dietaryPreferences: preferences,
          },
        })),
      setHealthRestrictions: (restrictions) =>
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            healthRestrictions: restrictions,
          },
        })),
      setMoodTracking: (moods) =>
        set((state) => ({
          userPreferences: { ...state.userPreferences, moodTracking: moods },
        })),
      setBudgetRange: (budget) =>
        set((state) => ({
          userPreferences: { ...state.userPreferences, budgetRange: budget },
        })),
      addSelectedRecommendation: (mood, recommendation) =>
        set((state) => ({
          selectedRecommendations: [
            ...state.selectedRecommendations,
            {
              recommendation,
              mood,
              selectedAt: new Date(),
            },
          ],
        })),
    }),
    {
      name: "food-store",
      version: 1,
    }
  )
);
