"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface FilterSelectorProps {
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
}

const FILTERS = [
  { id: "normal", name: "Normal" },
  { id: "grayscale", name: "Black & White" },
  { id: "sepia", name: "Sepia" },
  { id: "vintage", name: "Vintage" },
  { id: "cartoon", name: "Cartoon" },
  { id: "blur", name: "Blur" },
  { id: "brightness", name: "Bright" },
  { id: "contrast", name: "High Contrast" },
  { id: "neon", name: "Neon" },
  { id: "pixelate", name: "Pixelate" },
  { id: "rainbow", name: "Rainbow" },
  // New filters
  { id: "90s", name: "90's Retro" },
  { id: "2000s", name: "Y2K Digital" },
  { id: "noir", name: "Film Noir" },
  { id: "fisheye", name: "Fisheye" },
  { id: "rainbowAura", name: "Rainbow Aura" },
  { id: "glitch", name: "Glitch Art" },
  { id: "crosshatch", name: "Crosshatch" },
];

export default function FilterSelector({
  selectedFilter,
  onSelectFilter,
}: FilterSelectorProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [categoryView, setCategoryView] = useState<
    "all" | "classic" | "vintage" | "creative"
  >("all");

  // Simulate loading filters
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getFiltersByCategory = () => {
    if (categoryView === "all") return FILTERS;

    if (categoryView === "classic") {
      return FILTERS.filter((filter) =>
        [
          "normal",
          "grayscale",
          "sepia",
          "blur",
          "brightness",
          "contrast",
        ].includes(filter.id),
      );
    }

    if (categoryView === "vintage") {
      return FILTERS.filter((filter) =>
        ["vintage", "90s", "2000s", "noir"].includes(filter.id),
      );
    }

    if (categoryView === "creative") {
      return FILTERS.filter((filter) =>
        [
          "cartoon",
          "neon",
          "pixelate",
          "rainbow",
          "fisheye",
          "rainbowAura",
          "glitch",
          "crosshatch",
        ].includes(filter.id),
      );
    }

    return FILTERS;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-8 w-24 rounded-full flex-shrink-0"
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-20 rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  const filtersToShow = getFiltersByCategory();

  return (
    <div className="space-y-4">
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <Button
          variant={categoryView === "all" ? "default" : "outline"}
          className="rounded-full"
          size="sm"
          onClick={() => setCategoryView("all")}
        >
          All Filters
        </Button>
        <Button
          variant={categoryView === "classic" ? "default" : "outline"}
          className="rounded-full"
          size="sm"
          onClick={() => setCategoryView("classic")}
        >
          Classic
        </Button>
        <Button
          variant={categoryView === "vintage" ? "default" : "outline"}
          className="rounded-full"
          size="sm"
          onClick={() => setCategoryView("vintage")}
        >
          Vintage
        </Button>
        <Button
          variant={categoryView === "creative" ? "default" : "outline"}
          className="rounded-full"
          size="sm"
          onClick={() => setCategoryView("creative")}
        >
          Creative
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {filtersToShow.map((filter) => (
          <Button
            key={filter.id}
            variant={selectedFilter === filter.id ? "default" : "outline"}
            className="h-auto py-3 justify-start"
            onClick={() => onSelectFilter(filter.id)}
          >
            <div
              className="w-6 h-6 rounded-full mr-2 border"
              style={{
                background: getFilterPreviewColor(filter.id),
              }}
            />
            {filter.name}
          </Button>
        ))}
      </div>
    </div>
  );
}

function getFilterPreviewColor(filterId: string): string {
  switch (filterId) {
    case "grayscale":
      return "linear-gradient(to right, #333, #999)";
    case "sepia":
      return "linear-gradient(to right, #704214, #c09a6b)";
    case "vintage":
      return "linear-gradient(to right, #995522, #ddbb88)";
    case "cartoon":
      return "linear-gradient(to right, #ff5588, #88ddff)";
    case "blur":
      return "linear-gradient(to right, rgba(100,100,255,0.5), rgba(100,100,255,0.8))";
    case "brightness":
      return "linear-gradient(to right, #ffff00, #ffffff)";
    case "contrast":
      return "linear-gradient(to right, #000000, #ffffff)";
    case "neon":
      return "linear-gradient(to right, #ff00ff, #00ffff)";
    case "pixelate":
      return "repeating-linear-gradient(45deg, #ff6b6b 0px, #ff6b6b 5px, #4ecdc4 5px, #4ecdc4 10px)";
    case "rainbow":
      return "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)";
    // New filter preview colors
    case "90s":
      return "linear-gradient(to right, #ff9e2c, #ff6a00)";
    case "2000s":
      return "linear-gradient(to right, #ff00ff, #00ffff)";
    case "noir":
      return "linear-gradient(to right, #000, #555)";
    case "fisheye":
      return "radial-gradient(circle, #6699ff 10%, #003366 90%)";
    case "rainbowAura":
      return "radial-gradient(circle, white 30%, red, orange, yellow, green, blue, indigo, violet)";
    case "glitch":
      return "repeating-linear-gradient(90deg, #ff0000 0px, #ff0000 2px, #00ff00 2px, #00ff00 4px, #0000ff 4px, #0000ff 6px)";
    case "crosshatch":
      return "repeating-linear-gradient(45deg, #000 0px, #000 1px, #fff 1px, #fff 3px)";
    default:
      return "linear-gradient(to right, #4477ff, #44aaff)";
  }
}
