import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Meal {
  id: string;
  name: string;
  description: string;
  moodMatch: string;
  weatherContext?: string;
  timeContext?: string;
  savedAt?: Date;
}

interface Recommendation {
  name: string;
  cuisine: string;
  description: string;
  matchScore: number;
  moodAlignment: string;
  dietaryTags: string[];
  nutritionalBenefits: string[];
}

interface Preferences {
  nationality: string;
  dietaryPreferences: string[];
  moodTracking: string[];
  healthRestrictions: string[];
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
  userPreferences: Preferences;
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
  addSelectedRecommendation: (
    mood: string,
    recommendation: Recommendation
  ) => void;
  setUserPreferences: (
    preferences: Partial<FoodStore["userPreferences"]>
  ) => void;
  resetPreferences: () => void;
}

export const useFoodStore = create<FoodStore>()(
  persist(
    (set) => ({
      savedMeals: [],
      userPreferences: {
        nationality: "",
        dietaryPreferences: [],
        moodTracking: [],
        healthRestrictions: [],
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
      setUserPreferences: (preferences) =>
        set((state) => ({
          userPreferences: { ...state.userPreferences, ...preferences },
        })),
      resetPreferences: () => {
        set({
          userPreferences: {
            nationality: "",
            dietaryPreferences: [],
            moodTracking: [],
            healthRestrictions: [],
          },
          selectedRecommendations: [],
        });
      },
    }),
    {
      name: "food-store",
      version: 1,
    }
  )
);
