import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserPreferences {
  dietaryPreferences: string[];
  moodTracking: string[];
  cuisinePreferences: string[];
}

interface PreferencesStore {
  preferences: UserPreferences;
  setPreferences: (preferences: Partial<UserPreferences>) => void;
}

export const usePreferences = create<PreferencesStore>()(
  persist(
    (set) => ({
      preferences: {
        dietaryPreferences: [],
        moodTracking: [],
        cuisinePreferences: [],
      },
      setPreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),
    }),
    {
      name: "moodbite-preferences",
    }
  )
);
