"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface FilterSelectorProps {
  selectedFilter: string
  onSelectFilter: (filter: string) => void
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
]

export default function FilterSelector({ selectedFilter, onSelectFilter }: FilterSelectorProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading filters
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-20 rounded-md" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {FILTERS.map((filter) => (
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
  )
}

function getFilterPreviewColor(filterId: string): string {
  switch (filterId) {
    case "grayscale":
      return "linear-gradient(to right, #333, #999)"
    case "sepia":
      return "linear-gradient(to right, #704214, #c09a6b)"
    case "vintage":
      return "linear-gradient(to right, #995522, #ddbb88)"
    case "cartoon":
      return "linear-gradient(to right, #ff5588, #88ddff)"
    case "blur":
      return "linear-gradient(to right, rgba(100,100,255,0.5), rgba(100,100,255,0.8))"
    case "brightness":
      return "linear-gradient(to right, #ffff00, #ffffff)"
    case "contrast":
      return "linear-gradient(to right, #000000, #ffffff)"
    case "neon":
      return "linear-gradient(to right, #ff00ff, #00ffff)"
    case "pixelate":
      return "repeating-linear-gradient(45deg, #ff6b6b 0px, #ff6b6b 5px, #4ecdc4 5px, #4ecdc4 10px)"
    case "rainbow":
      return "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)"
    default:
      return "linear-gradient(to right, #4477ff, #44aaff)"
  }
}

