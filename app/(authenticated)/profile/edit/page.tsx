"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import LocationSelector from "@/components/common/location-selector"
import { type UpdateProfileData, userService } from "@/services/user.service"
import { useAuth } from "@/services/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { getTags, type Tag } from "@/services/tags.service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, Camera, CheckCircle, Clock, Loader2, MapPin, Phone, Plus, Trash2, User, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import toast, {Toaster} from "react-hot-toast"

interface Ward {
  name: string
  code: number
}

interface District {
  name: string
  code: number
  wards: Ward[]
}

interface Province {
  name: string
  code: number
  districts: District[]
}

interface SocialMediaLinks {
  [key: string]: string
}

interface PhotographerProfileData extends UpdateProfileData {
  price_per_hour?: number | null
  experience_years?: number | null
  social_media_links?: SocialMediaLinks
  tags?: string[]
}

export default function EditProfilePage() {
  const { token, user, isLoading: isAuthLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [activeTab, setActiveTab] = useState("basic")

  const [formData, setFormData] = useState<PhotographerProfileData>({
    full_name: "",
    phone_number: "",
    province: "",
    district: "",
    ward: "",
    address_detail: "",
    price_per_hour: 0,
    experience_years: 0,
    social_media_links: {},
    tags: [],
  })

  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMediaLinks>({})

  const [location, setLocation] = useState<{
    province: Province | null
    district: District | null
    ward: Ward | null
  }>({
    province: null,
    district: null,
    ward: null,
  })

  const [errors, setErrors] = useState<{
    full_name?: string
    phone_number?: string
    province?: string
    district?: string
    ward?: string
    address_detail?: string
    price_per_hour?: string
    experience_years?: string
  }>({})

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        router.push("/login")
        return
      }

      try {
        const [profile, tags] = await Promise.all([userService.getProfile(), getTags("photographer")])

        setFormData({
          full_name: profile.full_name || "",
          phone_number: profile.phone_number || "",
          province: profile.province || "",
          district: profile.district || "",
          ward: profile.ward || "",
          address_detail: profile.address_detail || "",
          price_per_hour: profile.price_per_hour || 0,
          experience_years: profile.experience_years || 0,
          tags: profile.tags || [],
          bio: profile.bio || "",
        })

        if (profile.social_media_links) {
          setSocialMediaLinks(profile.social_media_links)
        }

        setAvailableTags(tags)
      } catch (err) {
        console.error("Error loading data", err)
        toast.error("Không thể tải thông tin hồ sơ")
        router.push("/profile")
      } finally {
        setLoading(false)
      }
    }

    if (!isAuthLoading) {
      fetchData()
    }
  }, [token, isAuthLoading, router])

  // Update formData when location changes
  useEffect(() => {
    if (location.province?.name && location.district?.name && location.ward?.name) {
      setFormData((prev) => ({
        ...prev,
        province: location.province!.name,
        district: location.district!.name,
        ward: location.ward!.name,
      }))
    }
  }, [location])

  const handleTagChange = (tagName: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.includes(tagName) ? prev.tags.filter((t) => t !== tagName) : [...(prev.tags || []), tagName],
    }))
  }

  const validateForm = () => {
    const newErrors: typeof errors = {}
    if (!formData.full_name?.trim()) {
      newErrors.full_name = "Họ tên không được để trống"
    }
    if (!formData.phone_number?.trim()) {
      newErrors.phone_number = "Số điện thoại không được để trống"
    } else if (!/^\d{10}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Số điện thoại không hợp lệ"
    }
    if (!formData.province) {
      newErrors.province = "Vui lòng chọn tỉnh/thành phố"
    }
    if (!formData.district) {
      newErrors.district = "Vui lòng chọn quận/huyện"
    }
    if (!formData.ward) {
      newErrors.ward = "Vui lòng chọn phường/xã"
    }
    if (!formData.address_detail?.trim()) {
      newErrors.address_detail = "Địa chỉ chi tiết không được để trống"
    }
    if (user?.role === "photographer") {
      if (formData.price_per_hour === undefined || formData.price_per_hour === null || formData.price_per_hour < 0) {
        newErrors.price_per_hour = "Giá mỗi giờ phải là số dương"
      }
      if (formData.experience_years === undefined || formData.experience_years === null || formData.experience_years < 0) {
        newErrors.experience_years = "Số năm kinh nghiệm phải là số dương"
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      // Find which tab has errors and switch to it
      if (errors.full_name || errors.phone_number) {
        setActiveTab("basic")
      } else if (errors.province || errors.district || errors.ward || errors.address_detail) {
        setActiveTab("address")
      } else {
        setActiveTab("professional")
      }
      return
    }

    setUpdating(true)
    try {
      // Include social media links in the form data
      const dataToSubmit = {
        ...formData,
        social_media_links: socialMediaLinks,
      }

      const response = await userService.updateProfile(dataToSubmit, user?.role as "customer" | "photographer")
      console.log("Profile updated:", response)
      toast.success("Cập nhật thông tin thành công")
      router.push("/profile")
    } catch (err) {
      console.error("Error updating profile", err)
      toast.error("Cập nhật thông tin thất bại")
    } finally {
      setUpdating(false)
    }
  }

  if (isAuthLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Chỉnh sửa hồ sơ</h1>
          <p className="text-muted-foreground mt-1">Cập nhật thông tin cá nhân và chuyên môn của bạn</p>
        </div>

        <div className="flex items-center gap-2">
          <Avatar className="h-12 w-12 border-2 border-muted">
            <AvatarImage
              src={user?.avatar || "/placeholder.svg?height=40&width=40"}
              alt={user?.full_name || "Avatar"}
            />
            <AvatarFallback>{user?.full_name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user?.full_name || "Người dùng"}</p>
            <Badge variant="outline" className="text-xs">
              {user?.role === "photographer" ? "Nhiếp ảnh gia" : "Khách hàng"}
            </Badge>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Thông tin cơ bản</span>
              <span className="sm:hidden">Cơ bản</span>
              {(errors.full_name || errors.phone_number) && (
                <span className="h-2 w-2 rounded-full bg-destructive"></span>
              )}
            </TabsTrigger>
            <TabsTrigger value="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Địa chỉ</span>
              <span className="sm:hidden">Địa chỉ</span>
              {(errors.province || errors.district || errors.ward || errors.address_detail) && (
                <span className="h-2 w-2 rounded-full bg-destructive"></span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="professional"
              className="flex items-center gap-2"
              disabled={user?.role !== "photographer"}
            >
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">Thông tin chuyên môn</span>
              <span className="sm:hidden">Chuyên môn</span>
              {(errors.price_per_hour || errors.experience_years) && (
                <span className="h-2 w-2 rounded-full bg-destructive"></span>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cá nhân</CardTitle>
                  <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="flex items-center gap-1">
                      <User className="h-4 w-4" /> Họ tên
                    </Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="Nhập họ tên"
                      className={errors.full_name ? "border-destructive" : ""}
                    />
                    {errors.full_name && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.full_name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone_number" className="flex items-center gap-1">
                      <Phone className="h-4 w-4" /> Số điện thoại
                    </Label>
                    <Input
                      id="phone_number"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      placeholder="Nhập số điện thoại"
                      className={errors.phone_number ? "border-destructive" : ""}
                    />
                    {errors.phone_number && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.phone_number}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="address">
              <Card>
                <CardHeader>
                  <CardTitle>Địa chỉ</CardTitle>
                  <CardDescription>Cập nhật thông tin địa chỉ của bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> Chọn địa chỉ
                    </Label>
                    <LocationSelector onChange={setLocation} />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <Label htmlFor="province" className="text-xs text-muted-foreground mb-1 block">
                          Tỉnh/Thành phố
                        </Label>
                        <Input
                          id="province"
                          value={formData.province || ""}
                          readOnly
                          placeholder="Tỉnh/Thành phố"
                          className={errors.province ? "border-destructive" : ""}
                        />
                        {errors.province && (
                          <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {errors.province}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="district" className="text-xs text-muted-foreground mb-1 block">
                          Quận/Huyện
                        </Label>
                        <Input
                          id="district"
                          value={formData.district || ""}
                          readOnly
                          placeholder="Quận/Huyện"
                          className={errors.district ? "border-destructive" : ""}
                        />
                        {errors.district && (
                          <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {errors.district}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="ward" className="text-xs text-muted-foreground mb-1 block">
                          Phường/Xã
                        </Label>
                        <Input
                          id="ward"
                          value={formData.ward || ""}
                          readOnly
                          placeholder="Phường/Xã"
                          className={errors.ward ? "border-destructive" : ""}
                        />
                        {errors.ward && (
                          <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {errors.ward}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address_detail" className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> Số nhà, đường, tòa nhà...
                    </Label>
                    <Input
                      id="address_detail"
                      name="address_detail"
                      value={formData.address_detail || ""}
                      onChange={(e) => setFormData({ ...formData, address_detail: e.target.value })}
                      placeholder="Nhập địa chỉ chi tiết"
                      className={errors.address_detail ? "border-destructive" : ""}
                    />
                    {errors.address_detail && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {errors.address_detail}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="professional">
              {user?.role === "photographer" ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin chuyên môn</CardTitle>
                    <CardDescription>Cập nhật thông tin chuyên môn nhiếp ảnh của bạn</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="flex items-center gap-1">
                        <User className="h-4 w-4" /> Giới thiệu
                      </Label>
                      <Textarea
                        id="bio"
                        value={formData.bio || ""}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Giới thiệu về bản thân và kinh nghiệm của bạn"
                        className="min-h-[120px]"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="flex items-center gap-1">
                        <Camera className="h-4 w-4" /> Chuyên môn nhiếp ảnh
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {availableTags.map((tag) => (
                          <Badge
                            key={tag.name}
                            variant={formData.tags?.includes(tag.name) ? "default" : "outline"}
                            className="cursor-pointer hover:bg-muted transition-colors"
                            onClick={() => handleTagChange(tag.name)}
                          >
                            {formData.tags?.includes(tag.name) && <CheckCircle className="h-3 w-3 mr-1" />}
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="price_per_hour" className="flex items-center gap-1">
                          <Clock className="h-4 w-4" /> Giá mỗi giờ (VNĐ)
                        </Label>
                        <Input
                          id="price_per_hour"
                          type="number"
                          min="0"
                          value={formData.price_per_hour || 0}
                          onChange={(e) =>
                            setFormData({ ...formData, price_per_hour: Number.parseInt(e.target.value) })
                          }
                          placeholder="Nhập giá mỗi giờ"
                          className={errors.price_per_hour ? "border-destructive" : ""}
                        />
                        {errors.price_per_hour && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {errors.price_per_hour}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience_years" className="flex items-center gap-1">
                          <Clock className="h-4 w-4" /> Số năm kinh nghiệm
                        </Label>
                        <Input
                          id="experience_years"
                          type="number"
                          min="0"
                          value={formData.experience_years || 0}
                          onChange={(e) =>
                            setFormData({ ...formData, experience_years: Number.parseInt(e.target.value) })
                          }
                          placeholder="Nhập số năm kinh nghiệm"
                          className={errors.experience_years ? "border-destructive" : ""}
                        />
                        {errors.experience_years && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> {errors.experience_years}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-1">
                          <Globe className="h-4 w-4" /> Liên kết mạng xã hội
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSocialMediaLinks({
                              ...socialMediaLinks,
                              "": "",
                            })
                          }}
                          className="h-8 gap-1"
                        >
                          <Plus className="h-3.5 w-3.5" /> Thêm liên kết
                        </Button>
                      </div>

                      {Object.keys(socialMediaLinks).length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground text-sm bg-muted/30 rounded-md">
                          Chưa có liên kết mạng xã hội nào
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {Object.entries(socialMediaLinks).map(([platform, link], index) => (
                            <div key={index} className="flex gap-2 items-center">
                              <Input
                                value={platform}
                                onChange={(e) => {
                                  const newLinks = { ...socialMediaLinks }
                                  delete newLinks[platform]
                                  newLinks[e.target.value] = link
                                  setSocialMediaLinks(newLinks)
                                }}
                                placeholder="Nền tảng (Facebook, Instagram...)"
                                className="flex-1"
                              />
                              <Input
                                value={link}
                                onChange={(e) => {
                                  setSocialMediaLinks({
                                    ...socialMediaLinks,
                                    [platform]: e.target.value,
                                  })
                                }}
                                placeholder="URL"
                                className="flex-[2]"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const newLinks = { ...socialMediaLinks }
                                  delete newLinks[platform]
                                  setSocialMediaLinks(newLinks)
                                }}
                                className="h-10 w-10 text-destructive hover:text-destructive/90"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Không khả dụng</AlertTitle>
                  <AlertDescription>Thông tin chuyên môn chỉ dành cho tài khoản nhiếp ảnh gia.</AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end gap-4 mt-8">
          <Button variant="outline" type="button" onClick={() => router.push("/profile")} className="gap-2">
            <X className="h-4 w-4" /> Hủy
          </Button>
          <Button type="submit" className="gap-2" disabled={updating}>
            {updating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Cập nhật thông tin
              </>
            )}
          </Button>
        </div>
      </form>
      <Toaster position="bottom-right" />
    </div>
  )
}

// Globe icon component
function Globe(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}
