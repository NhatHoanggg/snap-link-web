"use client"

import type React from "react"

import { MapPin } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface LocationStepProps {
  formData: {
    province: string
    district: string
    ward: string
    address_detail: string
  }
  updateFormData: (data: Partial<LocationStepProps["formData"]>) => void
  onNext: () => void
  onPrev: () => void
}

export default function LocationStep({
  formData,
  updateFormData,
  onNext,
  onPrev,
}: LocationStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="province" className="text-sm font-medium">
            Province
          </Label>
          <Input
            id="province"
            value={formData.province}
            onChange={(e) => updateFormData({ province: e.target.value })}
            placeholder="Enter your province"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="district" className="text-sm font-medium">
            District
          </Label>
          <Input
            id="district"
            value={formData.district}
            onChange={(e) => updateFormData({ district: e.target.value })}
            placeholder="Enter your district"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ward" className="text-sm font-medium">
            Ward
          </Label>
          <Input
            id="ward"
            value={formData.ward}
            onChange={(e) => updateFormData({ ward: e.target.value })}
            placeholder="Enter your ward"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address_detail" className="text-sm font-medium">
            Detailed Address
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="address_detail"
              value={formData.address_detail}
              onChange={(e) => updateFormData({ address_detail: e.target.value })}
              className="pl-10"
              placeholder="Enter your detailed address"
              required
            />
          </div>
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