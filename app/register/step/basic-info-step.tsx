"use client"

import type React from "react"

import { User, Mail, Phone } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

interface BasicInfoStepProps {
  formData: {
    name: string
    email: string
    phoneNumber: string
    role: "CUSTOMER" | "PHOTOGRAPHER"
  }
  updateFormData: (data: Partial<BasicInfoStepProps["formData"]>) => void
  onNext: () => void
}

export default function BasicInfoStep({ formData, updateFormData, onNext }: BasicInfoStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="role" className="text-sm font-medium">
          {formData.role === "CUSTOMER" ? (
            <p className="text-sm font-medium">Customer</p>
          ) : (
            <p className="text-sm font-medium line-through italic">Customer</p>
          )}
        </Label>
        <Switch
          id="role"
          checked={formData.role === "PHOTOGRAPHER"}
          onCheckedChange={(checked: boolean) => updateFormData({ role: checked ? "PHOTOGRAPHER" : "CUSTOMER" })}
        />
        <Label htmlFor="role" className="text-sm font-medium">
          {formData.role === "PHOTOGRAPHER" ? (
            <p className="text-sm font-medium">Photographer</p>
          ) : (
            <p className="text-sm font-medium line-through italic">Photographer</p>
          )}
        </Label>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateFormData({ name: e.target.value })}
              className="pl-10"
              placeholder="John Doe"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData({ email: e.target.value })}
              className="pl-10"
              placeholder="name@example.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-sm font-medium">
            Phone Number
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
              className="pl-10"
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Continue
      </Button>
    </form>
  )
}
