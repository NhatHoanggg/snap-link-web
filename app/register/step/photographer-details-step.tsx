"use client"

import type React from "react"

import { MapPin } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface PhotographerDetailsStepProps {
  formData: {
    bio: string[]
    location: string
    pricePerHour?: number
  }
  updateFormData: (data: Partial<PhotographerDetailsStepProps["formData"]>) => void
  onNext: () => void
  onPrev: () => void
}

export default function PhotographerDetailsStep({
  formData,
  updateFormData,
  onNext,
  onPrev,
}: PhotographerDetailsStepProps) {
  const bioOptions = [
    "Portrait Photography",
    "Wedding Photography",
    "Landscape Photography",
    "Event Photography",
    "Fashion Photography",
    "Product Photography",
    "Street Photography",
    "Wildlife Photography",
  ]

  const handleBioChange = (value: string) => {
    updateFormData({
      bio: formData.bio.includes(value) ? formData.bio.filter((item) => item !== value) : [...formData.bio, value],
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bio" className="text-sm font-medium">
            Photography Specialties
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {bioOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={formData.bio.includes(option)}
                  onCheckedChange={() => handleBioChange(option)}
                />
                <Label htmlFor={option} className="text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium">
            Location
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => updateFormData({ location: e.target.value })}
              className="pl-10"
              placeholder="Your location"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pricePerHour" className="text-sm font-medium">
            Price per Hour ($)
          </Label>
          <Input
            id="pricePerHour"
            type="number"
            value={formData.pricePerHour}
            onChange={(e) => updateFormData({ pricePerHour: Number(e.target.value) })}
            placeholder="0"
            min="0"
            required
          />
        </div>
      </div>

      <div className="flex flex-col space-x-2 mt-4 gap-4">
        <Button type="button" variant="outline" className="w-full" onClick={onPrev}>
          Back
        </Button>
        <Button type="submit" className="w-full">
          Continue
        </Button>
      </div>
    </form>
  )
}
