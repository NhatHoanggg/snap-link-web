"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

export function SearchFilters() {
  const [category, setCategory] = useState("")
  const [priceRange, setPriceRange] = useState([50, 500])
  const [rating, setRating] = useState(0)

  const categories = [
    { value: "wedding", label: "Wedding" },
    { value: "portrait", label: "Portrait" },
    { value: "family", label: "Family" },
    { value: "event", label: "Event" },
    { value: "commercial", label: "Commercial" },
    { value: "real-estate", label: "Real Estate" },
    { value: "fashion", label: "Fashion" },
    { value: "food", label: "Food" },
  ]

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Category Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-between">
            {category ? categories.find((c) => c.value === category)?.label : "Category"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandList>
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {categories.map((c) => (
                  <CommandItem
                    key={c.value}
                    value={c.value}
                    onSelect={(currentValue: string) => {
                      setCategory(currentValue === category ? "" : currentValue)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", category === c.value ? "opacity-100" : "opacity-0")} />
                    {c.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Price Range Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-between">
            ${priceRange[0]} - ${priceRange[1]}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px]">
          <div className="space-y-4 p-2">
            <h4 className="font-medium">Price Range</h4>
            <Slider
              defaultValue={priceRange}
              min={0}
              max={1000}
              step={10}
              onValueChange={(value) => setPriceRange(value as number[])}
            />
            <div className="flex items-center justify-between">
              <div className="rounded-md border px-2 py-1">${priceRange[0]}</div>
              <div className="rounded-md border px-2 py-1">${priceRange[1]}</div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Rating Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-between">
            {rating > 0 ? `${rating}+ Stars` : "Rating"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px]">
          <div className="space-y-2 p-2">
            <h4 className="font-medium">Minimum Rating</h4>
            <div className="flex flex-col gap-2">
              {[0, 3, 3.5, 4, 4.5, 5].map((r) => (
                <Button
                  key={r}
                  variant="ghost"
                  className={cn("justify-start", rating === r && "bg-accent text-accent-foreground")}
                  onClick={() => setRating(r)}
                >
                  {r === 0 ? (
                    "Any rating"
                  ) : (
                    <div className="flex items-center">
                      {r}+
                      <span className="ml-2 flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(r) ? "text-amber-400" : "text-gray-300"}>
                            ★
                          </span>
                        ))}
                      </span>
                    </div>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Button variant="outline">More Filters</Button>
      <Button variant="default">Apply Filters</Button>
    </div>
  )
}

