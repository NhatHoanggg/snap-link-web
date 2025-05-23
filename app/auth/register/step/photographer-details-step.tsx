"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { getTags, Tag } from "@/services/tags.service"

interface PhotographerDetailsStepProps {
  formData: {
    tags: string[]
    pricePerHour?: number
    experienceYears: number
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
  const [tagOptions, setTagOptions] = useState<Tag[]>([])

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getTags("photographer")
        setTagOptions(tags)
      } catch (error) {
        console.error("Failed to fetch tags:", error)
      }
    }
    fetchTags()
  }, [])

  const handleTagChange = (value: string) => {
    updateFormData({
      tags: formData.tags.includes(value) ? formData.tags.filter((item) => item !== value) : [...formData.tags, value],
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
          <Label htmlFor="tags" className="text-sm font-medium">
            Chuyên môn
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {tagOptions.map((tag) => (
              <div key={tag.name} className="flex items-center space-x-2">
                <Checkbox
                  id={tag.name}
                  checked={formData.tags.includes(tag.name)}
                  onCheckedChange={() => handleTagChange(tag.name)}
                />
                <Label htmlFor={tag.name} className="text-sm">
                  {tag.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pricePerHour" className="text-sm font-medium">
            Giá /giờ ($)
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

        <div className="space-y-2">
          <Label htmlFor="experienceYears" className="text-sm font-medium">
            Năm kinh nghiệm
          </Label>
          <Input
            id="experienceYears"
            type="number"
            value={formData.experienceYears}
            onChange={(e) => updateFormData({ experienceYears: Number(e.target.value) })}
            placeholder="0"
            min="0"
            required
          />
        </div>
      </div>

      <div className="flex flex-col space-x-2 mt-4 gap-4">
        <Button type="button" variant="outline" className="w-full" onClick={onPrev}>
          Quay lại
        </Button>
        <Button type="submit" className="w-full">
          Tiếp tục
        </Button>
      </div>
    </form>
  )
}
