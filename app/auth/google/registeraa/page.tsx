"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  Camera,
  Users,
  DollarSign,
  Calendar,
  TagIcon,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { signIn } from "next-auth/react"
import LocationSelector from "@/components/common/location-selector"
import { getTags, type Tag as TagType } from "@/services/tags.service"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FormData {
  name: string
  email: string
  phoneNumber: string
  password: string
  confirmPassword: string
  role: "CUSTOMER" | "PHOTOGRAPHER" | ""
  tags: string[]
  province: string
  district: string
  ward: string
  address_detail: string
  pricePerHour?: number
  experienceYears: number
  agreeToTerms: boolean
}

interface Location {
  province: { name: string; code: number } | null
  district: { name: string; code: number } | null
  ward: { name: string; code: number } | null
}

export default function RegisterPage() {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [photographyTags, setPhotographyTags] = useState<TagType[]>([])
  const [location, setLocation] = useState<Location>({
    province: null,
    district: null,
    ward: null,
  })

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "",
    tags: [],
    province: "",
    district: "",
    ward: "",
    address_detail: "",
    pricePerHour: undefined,
    experienceYears: 0,
    agreeToTerms: false,
  })

  const maxSteps = formData.role === "PHOTOGRAPHER" ? 5 : 4
  const progress = (currentStep / maxSteps) * 100

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getTags("photographer")
        setPhotographyTags(response)
      } catch (error) {
        console.error("Error fetching tags:", error)
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải danh sách chuyên môn",
        })
      }
    }
    fetchTags()
  }, [toast])

  useEffect(() => {
    if (location.province) {
      setFormData((prev) => ({
        ...prev,
        province: location.province?.name || "",
        district: location.district?.name || "",
        ward: location.ward?.name || "",
      }))
    }
  }, [location])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleTagToggle = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }))
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.role) newErrors.role = "Vui lòng chọn vai trò"
      if (!formData.name.trim()) newErrors.name = "Vui lòng nhập họ tên"
      if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email"
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Vui lòng nhập số điện thoại"
    }

    if (step === 2) {
      if (formData.password.length < 6) newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự"
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Mật khẩu xác nhận không khớp"
      }
    }

    if (formData.role === "PHOTOGRAPHER") {
      if (step === 3) {
        if (formData.tags.length === 0) newErrors.tags = "Vui lòng chọn ít nhất một chuyên môn"
      }
      if (step === 4) {
        if (!formData.pricePerHour || formData.pricePerHour <= 0) {
          newErrors.pricePerHour = "Vui lòng nhập giá dịch vụ"
        }
        if (!location.province) newErrors.province = "Vui lòng chọn tỉnh/thành phố"
        if (!location.ward) newErrors.ward = "Vui lòng chọn phường/xã"
        if (!formData.address_detail.trim()) newErrors.address_detail = "Vui lòng nhập địa chỉ chi tiết"
      }
    } else {
      if (step === 3) {
        if (!location.province) newErrors.province = "Vui lòng chọn tỉnh/thành phố"
        if (!location.ward) newErrors.ward = "Vui lòng chọn phường/xã"
        if (!formData.address_detail.trim()) newErrors.address_detail = "Vui lòng nhập địa chỉ chi tiết"
      }
    }

    if (step === (formData.role === "PHOTOGRAPHER" ? 5 : 4)) {
      if (!formData.agreeToTerms) newErrors.agreeToTerms = "Vui lòng đồng ý với điều khoản"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, maxSteps))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(currentStep)) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "Đăng ký thành công!",
        description: "Tài khoản của bạn đã được tạo.",
      })
    } catch (error) {
      console.log("error -->", error)
      toast({
        title: "Đăng ký thất bại",
        description: "Có lỗi xảy ra, vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = () => {
    signIn("google", { callbackUrl: "/google-token" })
  }

  const getStepHeading = () => {
    switch (currentStep) {
      case 1:
        return "Thông tin cơ bản"
      case 2:
        return "Bảo mật tài khoản"
      case 3:
        return formData.role === "PHOTOGRAPHER" ? "Chuyên môn" : "Địa chỉ"
      case 4:
        return formData.role === "PHOTOGRAPHER" ? "Địa chỉ" : "Xác nhận thông tin"
      case 5:
        return "Xác nhận thông tin"
      default:
        return ""
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="text-base font-medium">Bạn là ai?</Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleSelectChange("role", "CUSTOMER")}
                    className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                      formData.role === "CUSTOMER"
                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                        : "border-muted hover:border-primary/40 text-muted-foreground hover:text-foreground hover:shadow-sm"
                    }`}
                  >
                    <Users className="h-10 w-10 mb-3" />
                    <span className="font-medium text-lg">Khách hàng</span>
                    <span className="text-sm mt-1 text-muted-foreground">Tìm photographer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectChange("role", "PHOTOGRAPHER")}
                    className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                      formData.role === "PHOTOGRAPHER"
                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                        : "border-muted hover:border-primary/40 text-muted-foreground hover:text-foreground hover:shadow-sm"
                    }`}
                  >
                    <Camera className="h-10 w-10 mb-3" />
                    <span className="font-medium text-lg">Photographer</span>
                    <span className="text-sm mt-1 text-muted-foreground">Cung cấp dịch vụ</span>
                  </button>
                </div>
                {errors.role && <p className="text-sm text-destructive mt-1">{errors.role}</p>}
              </div>

              <div className="space-y-2 pt-4">
                <Label htmlFor="name" className="text-base font-medium">
                  Họ và tên
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="Nguyễn Văn A"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-base font-medium">
                  Số điện thoại
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="0123456789"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                {errors.phoneNumber && <p className="text-sm text-destructive mt-1">{errors.phoneNumber}</p>}
              </div>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-medium">
                  Mật khẩu
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 h-12 text-base pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
                <p className="text-xs text-muted-foreground mt-1">Mật khẩu cần có ít nhất 6 ký tự</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-base font-medium">
                  Xác nhận mật khẩu
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 h-12 text-base pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
          </motion.div>
        )

      case 3:
        if (formData.role === "PHOTOGRAPHER") {
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="pricePerHour" className="text-base font-medium">
                      Giá/giờ (VNĐ)
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="pricePerHour"
                        name="pricePerHour"
                        type="number"
                        placeholder="500000"
                        value={formData.pricePerHour || ""}
                        onChange={handleChange}
                        className="pl-10 h-12 text-base"
                      />
                    </div>
                    {errors.pricePerHour && <p className="text-sm text-destructive mt-1">{errors.pricePerHour}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experienceYears" className="text-base font-medium">
                      Kinh nghiệm (năm)
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="experienceYears"
                        name="experienceYears"
                        type="number"
                        placeholder="2"
                        value={formData.experienceYears}
                        onChange={handleChange}
                        className="pl-10 h-12 text-base"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">Chuyên môn</Label>
                  <div className="rounded-lg border p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                      {photographyTags.map((tag) => (
                        <button
                          key={tag.name}
                          type="button"
                          onClick={() => handleTagToggle(tag.name)}
                          className={`flex items-center justify-center py-2 px-3 rounded-lg border transition-all ${
                            formData.tags.includes(tag.name)
                              ? "border-primary bg-primary/10 text-primary font-medium"
                              : "border-muted hover:border-primary/30 text-foreground"
                          }`}
                        >
                          <TagIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">{tag.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  {errors.tags && <p className="text-sm text-destructive mt-1">{errors.tags}</p>}
                </div>
              </div>
            </motion.div>
          )
        }
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-medium">Địa chỉ</Label>
                <Card className="border overflow-hidden">
                  <CardContent className="p-4">
                    <LocationSelector onChange={setLocation} />
                  </CardContent>
                </Card>
                {errors.province && <p className="text-sm text-destructive mt-1">{errors.province}</p>}
                {errors.ward && <p className="text-sm text-destructive mt-1">{errors.ward}</p>}
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="address_detail" className="text-base font-medium">
                  Địa chỉ chi tiết
                </Label>
                <Textarea
                  id="address_detail"
                  name="address_detail"
                  placeholder="Số nhà, tên đường..."
                  value={formData.address_detail}
                  onChange={handleChange}
                  className="min-h-[100px] text-base resize-none"
                />
                {errors.address_detail && <p className="text-sm text-destructive mt-1">{errors.address_detail}</p>}
              </div>
            </div>
          </motion.div>
        )

      case 4:
        if (formData.role === "PHOTOGRAPHER") {
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Địa chỉ</Label>
                  <Card className="border overflow-hidden">
                    <CardContent className="p-4">
                      <LocationSelector onChange={setLocation} />
                    </CardContent>
                  </Card>
                  {errors.province && <p className="text-sm text-destructive mt-1">{errors.province}</p>}
                  {errors.ward && <p className="text-sm text-destructive mt-1">{errors.ward}</p>}
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="address_detail" className="text-base font-medium">
                    Địa chỉ chi tiết
                  </Label>
                  <Textarea
                    id="address_detail"
                    name="address_detail"
                    placeholder="Số nhà, tên đường..."
                    value={formData.address_detail}
                    onChange={handleChange}
                    className="min-h-[100px] text-base resize-none"
                  />
                  {errors.address_detail && <p className="text-sm text-destructive mt-1">{errors.address_detail}</p>}
                </div>
              </div>
            </motion.div>
          )
        }
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <Card className="border-muted">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Thông tin tài khoản</h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-sm">
                    <div className="text-muted-foreground">Vai trò:</div>
                    <div className="font-medium">Khách hàng</div>

                    <div className="text-muted-foreground">Họ tên:</div>
                    <div className="font-medium">{formData.name}</div>

                    <div className="text-muted-foreground">Email:</div>
                    <div className="font-medium">{formData.email}</div>

                    <div className="text-muted-foreground">Số điện thoại:</div>
                    <div className="font-medium">{formData.phoneNumber}</div>

                    <div className="text-muted-foreground">Địa chỉ:</div>
                    <div className="font-medium">
                      {formData.address_detail}, {formData.ward}, {formData.district}, {formData.province}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-start space-x-3 pt-2">
              <Checkbox
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeToTerms: checked as boolean }))}
              />
              <div className="text-sm">
                <Label htmlFor="agreeToTerms" className="cursor-pointer">
                  Tôi đồng ý với{" "}
                  <Link href="/terms" className="text-primary hover:text-primary/80 underline font-medium">
                    Điều khoản dịch vụ
                  </Link>{" "}
                  và{" "}
                  <Link href="/privacy" className="text-primary hover:text-primary/80 underline font-medium">
                    Chính sách bảo mật
                  </Link>
                </Label>
              </div>
            </div>
            {errors.agreeToTerms && <p className="text-sm text-destructive">{errors.agreeToTerms}</p>}
          </motion.div>
        )

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <Card className="border-muted">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Thông tin tài khoản</h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-sm">
                    <div className="text-muted-foreground">Vai trò:</div>
                    <div className="font-medium">Photographer</div>

                    <div className="text-muted-foreground">Họ tên:</div>
                    <div className="font-medium">{formData.name}</div>

                    <div className="text-muted-foreground">Email:</div>
                    <div className="font-medium">{formData.email}</div>

                    <div className="text-muted-foreground">Số điện thoại:</div>
                    <div className="font-medium">{formData.phoneNumber}</div>

                    <div className="text-muted-foreground">Giá/giờ:</div>
                    <div className="font-medium text-primary">{formData.pricePerHour?.toLocaleString()} VNĐ</div>

                    <div className="text-muted-foreground">Kinh nghiệm:</div>
                    <div className="font-medium">{formData.experienceYears} năm</div>

                    <div className="text-muted-foreground">Địa chỉ:</div>
                    <div className="font-medium">
                      {formData.address_detail}, {formData.ward}, {formData.district}, {formData.province}
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="text-sm text-muted-foreground mb-2">Chuyên môn:</div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-start space-x-3 pt-2">
              <Checkbox
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeToTerms: checked as boolean }))}
              />
              <div className="text-sm">
                <Label htmlFor="agreeToTerms" className="cursor-pointer">
                  Tôi đồng ý với{" "}
                  <Link href="/terms" className="text-primary hover:text-primary/80 underline font-medium">
                    Điều khoản dịch vụ
                  </Link>{" "}
                  và{" "}
                  <Link href="/privacy" className="text-primary hover:text-primary/80 underline font-medium">
                    Chính sách bảo mật
                  </Link>
                </Label>
              </div>
            </div>
            {errors.agreeToTerms && <p className="text-sm text-destructive">{errors.agreeToTerms}</p>}
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <div className="w-full max-w-[1100px] flex flex-col lg:flex-row bg-background rounded-2xl shadow-lg overflow-hidden">
        {/* Left Side - Brand */}
        <div className="relative hidden lg:block lg:w-5/12 xl:w-1/2 bg-gradient-to-br from-primary to-purple-600 text-white">
          <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" viewBox="0 0 400 400" preserveAspectRatio="none">
              <defs>
                <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="2" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>

          <div className="relative h-full p-8 flex flex-col justify-between z-10">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold">SnapLink</h2>
            </div>

            <div className="space-y-6 py-12">
              <h1 className="text-3xl xl:text-4xl font-bold leading-tight">
                {formData.role === "PHOTOGRAPHER"
                  ? "Chia sẻ tài năng và phát triển sự nghiệp nhiếp ảnh của bạn"
                  : "Tìm kiếm photographer chuyên nghiệp cho khoảnh khắc đặc biệt của bạn"}
              </h1>

              <p className="text-white/80 text-lg">
                {formData.role === "PHOTOGRAPHER"
                  ? "Trở thành một phần của mạng lưới nhiếp ảnh gia chuyên nghiệp, kết nối với khách hàng tiềm năng và phát triển sự nghiệp của bạn."
                  : "Tìm kiếm và kết nối với những nhiếp ảnh gia tài năng để lưu giữ những kỷ niệm quan trọng trong cuộc sống của bạn."}
              </p>
            </div>

            <div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-white/90">Tiến trình</p>
                  <p className="text-white/90 font-medium">
                    {currentStep}/{maxSteps}
                  </p>
                </div>
                <Progress value={progress} className="h-2 bg-white/20" />
              </div>

              <div className="mt-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Lock className="h-6 w-6" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    {formData.role === "PHOTOGRAPHER" ? <TagIcon className="h-6 w-6" /> : <User className="h-6 w-6" />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-7/12 xl:w-1/2 p-4 sm:p-8">
          <div className="lg:hidden flex items-center space-x-2 mb-6">
            <div className="h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center">
              <Camera className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold">SnapLink</h2>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold">Tạo tài khoản mới</h1>
            <p className="text-muted-foreground mt-2">
              Bước {currentStep}/{maxSteps}: {getStepHeading()}
            </p>

            <div className="mt-4 lg:hidden">
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

            <div className="flex items-center justify-between pt-4">
              {currentStep > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep} className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại
                </Button>
              ) : (
                <div></div> // Empty div to maintain spacing
              )}

              {currentStep < maxSteps ? (
                <Button type="button" onClick={nextStep} className="flex items-center">
                  Tiếp tục
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading} className="flex items-center">
                  {isLoading ? "Đang xử lý..." : "Hoàn thành đăng ký"}
                </Button>
              )}
            </div>

            {currentStep === 1 && (
              <>
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-muted"></div>
                  <span className="flex-shrink mx-4 text-muted-foreground text-sm">hoặc đăng ký với</span>
                  <div className="flex-grow border-t border-muted"></div>
                </div>

                <Button
                  variant="outline"
                  type="button"
                  className="w-full h-12 flex items-center justify-center font-medium"
                  onClick={handleGoogleSignUp}
                >
                  <Image src="/media/google.svg" alt="Google" width={20} height={20} className="mr-3 h-5 w-5" />
                  Google
                </Button>
              </>
            )}

            <div className="text-center text-sm pt-4">
              <p className="text-muted-foreground">
                Đã có tài khoản?{" "}
                <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
