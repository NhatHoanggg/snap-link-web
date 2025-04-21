"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface FinalStepProps {
  formData: {
    agreeToTerms: boolean
  }
  updateFormData: (data: Partial<FinalStepProps["formData"]>) => void
  onSubmit: () => void
  onPrev: () => void
  isLoading: boolean
}

export default function FinalStep({ formData, updateFormData, onSubmit, onPrev, isLoading }: FinalStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) => updateFormData({ agreeToTerms: checked as boolean })}
          />
          <Label htmlFor="terms" className="text-sm">
            I agree to the{" "}
            <Link href="/terms" className="text-primary hover:underline">
              terms and conditions
            </Link>
          </Label>
        </div>

        <div className="relative flex items-center justify-center">
          <Separator className="w-full" />
          <span className="absolute bg-card px-2 text-xs text-muted-foreground">OR CONTINUE WITH</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" type="button" className="w-full">
            <Image src="/media/google.svg" alt="Google" width={16} height={16} className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button variant="outline" type="button" className="w-full">
            <Image src="/media/facebook.svg" alt="Facebook" width={16} height={16} className="mr-2 h-4 w-4" />
            Facebook
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>

      <div className="flex flex-col space-x-2 mt-4 gap-4">
        <Button type="button" variant="outline" className="w-full" onClick={onPrev}>
          Back
        </Button>
        <Button type="submit" className="w-full" disabled={isLoading || !formData.agreeToTerms}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </div>
    </form>
  )
}
