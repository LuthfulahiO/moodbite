import { useState } from "react";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import { useFoodStore } from "@/store/food-store";
import { countries } from "countries-list";

// Create a formatted list of countries for react-select
const countryOptions = Object.entries(countries).map(([code, country]) => ({
  value: country.name,
  label: `${country.name}`,
}));

// Custom styles for the select component to match your theme
const customStyles = {
  control: (base: any) => ({
    ...base,
    background: "rgb(23, 23, 23)",
    borderColor: "rgb(38, 38, 38)",
    "&:hover": {
      borderColor: "rgb(64, 64, 64)",
    },
  }),
  menu: (base: any) => ({
    ...base,
    background: "rgb(23, 23, 23)",
    border: "1px solid rgb(38, 38, 38)",
  }),
  option: (base: any, state: { isFocused: boolean; isSelected: boolean }) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "rgb(64, 64, 64)"
      : state.isFocused
      ? "rgb(38, 38, 38)"
      : undefined,
    "&:active": {
      backgroundColor: "rgb(64, 64, 64)",
    },
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "white",
  }),
  input: (base: any) => ({
    ...base,
    color: "white",
  }),
};

const Option = ({ children, ...props }: any) => (
  <div
    {...props.innerProps}
    className={`flex items-center px-3 py-2 cursor-pointer ${
      props.isFocused ? "bg-neutral-800" : ""
    } ${props.isSelected ? "bg-neutral-700" : ""}`}
  >
    {children}
  </div>
);

export function Nationality({ onNext }: { onNext: () => void }) {
  const [selectedCountry, setSelectedCountry] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const updatePreferences = useFoodStore((state) => state.updatePreferences);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCountry) {
      updatePreferences({ nationality: selectedCountry.value });
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">What&apos;s your nationality?</h2>
          <p className="text-neutral-400">
            This helps us suggest dishes that match your cultural preferences
          </p>
        </div>
        <div className="space-y-2">
          <Select
            options={countryOptions}
            styles={customStyles}
            components={{ Option }}
            value={selectedCountry}
            onChange={(option) => setSelectedCountry(option)}
            placeholder="Select your nationality"
            isSearchable
            required
            className="text-base"
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={!selectedCountry}>
        Continue
      </Button>
    </form>
  );
}
