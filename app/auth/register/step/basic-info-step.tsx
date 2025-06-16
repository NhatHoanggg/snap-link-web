"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import { User, Mail, Phone } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import toast, { Toaster } from "react-hot-toast"

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
  const searchParams = useSearchParams()
  const emailParam = searchParams.get("email")
  const nameParam = searchParams.get("name")

  const [isEmailReadOnly, setIsEmailReadOnly] = useState(false)
  const [isNameReadOnly, setIsNameReadOnly] = useState(false)

  useEffect(() => {
    if (emailParam && formData.email !== emailParam) {
      updateFormData({ email: emailParam })
      setIsEmailReadOnly(true)
    }
  }, [emailParam, formData.email, updateFormData])

  useEffect(() => {
    if (nameParam && formData.name !== nameParam) {
      updateFormData({ name: nameParam })
      setIsNameReadOnly(true)
    }
  }, [nameParam, formData.name, updateFormData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.length < 3 || formData.name.length > 50) {
      toast.error("Họ và tên phải có từ 3 đến 50 ký tự")
      return
    }
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* SWITCH ROLE */}
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="role" className="text-sm font-medium">
          {formData.role === "CUSTOMER" ? (
            <p className="text-sm font-medium">Khách hàng</p>
          ) : (
            <p className="text-sm font-medium line-through italic">Khách hàng</p>
          )}
        </Label>
        <Switch
          id="role"
          checked={formData.role === "PHOTOGRAPHER"}
          onCheckedChange={(checked: boolean) =>
            updateFormData({ role: checked ? "PHOTOGRAPHER" : "CUSTOMER" })
          }
        />
        <Label htmlFor="role" className="text-sm font-medium">
          {formData.role === "PHOTOGRAPHER" ? (
            <p className="text-sm font-medium">Nhiếp ảnh gia</p>
          ) : (
            <p className="text-sm font-medium line-through italic">Nhiếp ảnh gia</p>
          )}
        </Label>
      </div>

      {/* NAME */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">Họ và tên</Label>
        <div className="relative">
          <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            className="pl-10"
            placeholder="Nhập họ và tên"
            required
            readOnly={isNameReadOnly}
          />
        </div>
      </div>

      {/* EMAIL */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
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
            readOnly={isEmailReadOnly}
          />
        </div>
      </div>

      {/* PHONE */}
      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="text-sm font-medium">Số điện thoại</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
            className="pl-10"
            placeholder="Nhập số điện thoại"
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Tiếp tục
      </Button>
      <Toaster position="bottom-right" />
    </form>
  )
}
