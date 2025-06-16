"use client"

import type React from "react"

import { useState } from "react"
import { Lock, Eye, EyeOff } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import toast, { Toaster } from "react-hot-toast"
interface PasswordStepProps {
  formData: {
    password: string
    confirmPassword: string
  }
  updateFormData: (
    data: Partial<{
      password: string
      confirmPassword: string
    }>,
  ) => void
  onNext: () => void
  onPrev: () => void
}

export default function PasswordStep({ formData, updateFormData, onNext, onPrev }: PasswordStepProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password.length < 8 || formData.password.length > 20) {
      // Handle password length error
      toast.error("Mật khẩu phải có từ 8 đến 20 ký tự")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      // Handle password mismatch error
      toast.error("Mật khẩu không khớp")
      return
    }

    onNext()
  }

  // Password strength calculation
  const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0

    let strength = 0

    // Length check
    if (password.length >= 8) strength += 25

    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    if (/[^A-Za-z0-9]/.test(password)) strength += 25

    return strength
  }

  const passwordStrength = calculatePasswordStrength(formData.password)

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return ""
    if (passwordStrength <= 25) return "Yếu"
    if (passwordStrength <= 50) return "Trung bình"
    if (passwordStrength <= 75) return "Khá"
    return "Mạnh"
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-destructive"
    if (passwordStrength <= 50) return "bg-amber-500"
    if (passwordStrength <= 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Mật khẩu
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => updateFormData({ password: e.target.value })}
              className="pl-10"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {formData.password && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Độ mạnh mật khẩu:</span>
                <span
                  className={
                    passwordStrength > 75
                      ? "text-green-500"
                      : passwordStrength > 50
                        ? "text-yellow-500"
                        : passwordStrength > 25
                          ? "text-amber-500"
                          : "text-destructive"
                  }
                >
                  {getPasswordStrengthText()}
                </span>
              </div>
              <Progress value={passwordStrength} className={cn("h-1.5", getPasswordStrengthColor())} />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Nhập lại mật khẩu
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
              className={`pl-10 ${formData.confirmPassword && !passwordsMatch ? "border-destructive" : ""}`}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {formData.confirmPassword && !passwordsMatch && (
            <p className="text-xs text-destructive mt-1">Mật khẩu không khớp</p>
          )}
        </div>
      </div>

      <div className="flex flex-col space-x-2 mt-4 gap-4">
        <Button type="button" variant="outline" className="w-full" onClick={onPrev}>
          Quay lại
        </Button>
        <Button type="submit" className="w-full" disabled={!passwordsMatch}>
          Tiếp tục
        </Button>
      </div>
      <Toaster position="bottom-right" />
    </form>
  )
}
