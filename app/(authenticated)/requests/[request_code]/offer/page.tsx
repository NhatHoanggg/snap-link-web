"use client"

import { useEffect, useState, use } from "react"
import { getRequestByCode, type RequestResponse } from "@/services/request.service"
import { getServices, type Service } from "@/services/services.service"
import { userService, type UserProfileResponse } from "@/services/user.service"
import { createOffer, type OfferCreate } from "@/services/offer.service"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarIcon,
  CheckCircle,
  Clock,
  DollarSign,
  Info,
  Lightbulb,
  MapPin,
  MessageSquare,
  Package,
  Percent,
  Tag,
  User,
  MapPinned 
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import { AxiosError } from "axios"
import toast, { Toaster, ToastBar } from "react-hot-toast";


export default function RequestOfferPage({ params }: { params: Promise<{ request_code: string }> }) {
  const { request_code } = use(params)
  const [request, setRequest] = useState<RequestResponse | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [user, setUser] = useState<UserProfileResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("details")
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [customPrice, setCustomPrice] = useState<number | null>(null)
  const [discountPercent, setDiscountPercent] = useState<number>(0)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  
  // Add error message mapping
  const errorMessages: { [key: string]: string } = {
    "Cannot create offer for closed request": "Không thể tạo đề xuất cho yêu cầu đã bị hủy bởi khách hàng",
    "You are not available on the requested date": "Bạn đã bận hoặc có lịch chụp vào ngày chụp của yêu cầu này",
    "You have already created an offer for this request": "Bạn đã tạo request cho yêu cầu này"
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requestData, servicesData] = await Promise.all([getRequestByCode(request_code), getServices()])
        setRequest(requestData)
        setServices(servicesData)

        // Fetch user data if we have request data
        if (requestData) {
          try {
            const userData = await userService.getUserById(requestData.user_id)
            setUser(userData)
          } catch (err) {
            console.error("Error fetching user data:", err)
          }
        }

        // Set initial custom price if we have services
        if (servicesData.length > 0) {
          setCustomPrice(servicesData[0].price)
        }
      } catch (err) {
        setError("Không thể tải thông tin buổi chụp")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [request_code])

  // console.log(request)

  // Calculate discount percentage
  const calculateDiscount = () => {
    if (!selectedService || !customPrice) return 0
    return Math.round(100 - (customPrice / selectedService.price) * 100)
  }

  // Update price when discount changes
  const handleDiscountChange = (percent: number) => {
    if (!selectedService) return
    setDiscountPercent(percent)
    const newPrice = Math.round(selectedService.price * (1 - percent / 100))
    setCustomPrice(newPrice)
  }

  // Update discount when price changes
  const handlePriceChange = (price: number) => {
    if (!selectedService) return
    setCustomPrice(price)
    const newDiscount = Math.round(100 - (price / selectedService.price) * 100)
    setDiscountPercent(newDiscount)
  }

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setCustomPrice(service.price)
    setDiscountPercent(0)
    setActiveTab("offer")
  }

  const handleSubmitOffer = async () => {
    if (!selectedService || !request || !customPrice) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const offerData: OfferCreate = {
        service_id: selectedService.service_id,
        custom_price: customPrice,
        message: message.trim()
      }

      await createOffer(request.request_id, offerData)
      
      toast.success("Yêu cầu của bạn đã được gửi thành công!")
      window.location.href = "/requests" 
    } catch (err: unknown) {
      console.error("Error creating offer:", err)

      if (err instanceof AxiosError) {
        console.log("hello")
        const errorMessage = err.response?.data?.detail as string
        if (errorMessages[errorMessage]) {
          setSubmitError(errorMessages[errorMessage])
        } else {
          setSubmitError("Không thể gửi đề xuất. Vui lòng thử lại sau.")
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "matched":
        return "bg-green-100 text-green-800 border-green-200"
      case "open":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "matched":
        return "Đã ghép đôi"
      case "open":
        return "Đang mở"
      case "closed":
        return "Đã đóng"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Đang tải thông tin...</p>
      </div>
    )
  }

  if (error || !request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-destructive text-lg font-medium">{error || "Không tìm thấy thông tin buổi chụp"}</div>
        <Button onClick={() => window.location.reload()}>Thử lại</Button>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
    <Link href="/requests"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
    >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại
    </Link>
      <div className="bg-muted/30 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="flex items-center gap-1.5">
                <Tag className="h-3 w-3" />#{request.request_code}
              </Badge>
              <Badge variant="outline" className={cn(getStatusColor(request.status))}>
                {getStatusText(request.status)}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-foreground">{request.concept}</h1>
            <p className="text-muted-foreground mt-1">Tạo đề xuất của bạn cho buổi chụp này để có cơ hội được chọn</p>
          </div>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-md">
                    💰Ngân sách dự kiến: 
                    <span className="font-medium">{request.estimated_budget.toLocaleString("vi-VN")} VNĐ</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ngân sách dự kiến của khách hàng</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="details" className="text-base">
                Chi tiết yêu cầu
              </TabsTrigger>
              <TabsTrigger value="offer" className="text-base">
                Tạo đề xuất
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Thông tin buổi chụp
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-md">
                          <CalendarIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Ngày chụp:</p>
                          <p className="font-medium">{format(new Date(request.request_date), "PPP", { locale: vi })}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-md">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Tỉnh/Thành phố:</p>
                          {/* <p className="font-medium">{request.location_text}</p> */}
                          <p className="font-medium">{request.province}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-md">
                          <MapPinned className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Địa điểm:</p>
                          <p className="font-medium">{request.location_text}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-md">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Khách hàng:</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Avatar className="h-6 w-6">
                              {user?.avatar ? (
                                <Image
                                  src={user.avatar}
                                  alt="Avatar"
                                  fill
                                  className="rounded-full object-cover"
                                />
                              ) : (
                                <AvatarFallback>
                                  {user?.full_name?.charAt(0) || "KH"}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <p className="font-medium">{user?.full_name || `Khách hàng`}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">

                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-md">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Loại chụp:</p>
                          <p className="font-medium">{request.shooting_type}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-md">
                          <DollarSign className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Ngân sách dự kiến:</p>
                          <p className="font-medium text-primary">
                            {request.estimated_budget.toLocaleString("vi-VN")} VNĐ
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {request.illustration_url && (
                    <div>
                      <Separator className="my-4" />
                      <div className="space-y-2">
                        <h3 className="font-medium flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-primary" />
                          Hình ảnh tham khảo:
                        </h3>
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                          <Image
                            src={request.illustration_url || "/placeholder.svg"}
                            alt="Illustration"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={() => setActiveTab("offer")} className="gap-2">
                  Tạo đề xuất
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="offer" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Tạo đề xuất của bạn
                  </CardTitle>
                  <CardDescription>Chọn một gói dịch vụ và điều chỉnh giá đề xuất cho khách hàng</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Gói dịch vụ đã chọn</h3>
                      {selectedService && (
                        <Button variant="outline" size="sm" onClick={() => setSelectedService(null)}>
                          Thay đổi
                        </Button>
                      )}
                    </div>

                    {selectedService ? (
                      <div className="border rounded-lg overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="relative aspect-square md:aspect-auto">
                            <Image
                              src={selectedService.thumbnail_url || "/placeholder.svg"}
                              alt={selectedService.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4 md:col-span-2">
                            <h3 className="font-semibold text-lg mb-2">{selectedService.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4 whitespace-pre-line break-words">{selectedService.description}</p>
                            <div className="flex items-center gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Giá gốc:</p>
                                <p className="font-medium">{selectedService.price.toLocaleString("vi-VN")} VNĐ</p>
                              </div>
                              <Separator orientation="vertical" className="h-8" />
                              <div>
                                <p className="text-sm text-muted-foreground">Giá đề xuất:</p>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-primary">{customPrice?.toLocaleString("vi-VN")} VNĐ</p>
                                  {calculateDiscount() > 0 && (
                                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                      Giảm {calculateDiscount()}%
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center border rounded-lg">
                        <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">Vui lòng chọn một gói dịch vụ từ danh sách bên phải</p>
                      </div>
                    )}

                    {selectedService && (
                      <>
                        <Separator className="my-4" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Price Input */}
                          <div className="space-y-2">
                            <Label htmlFor="custom-offer-price" className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              Giá đề xuất
                            </Label>
                            <div className="relative">
                              <Input
                                id="custom-offer-price"
                                type="number"
                                value={customPrice || ""}
                                onChange={(e) => handlePriceChange(Number(e.target.value))}
                                className="pl-12"
                              />
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                VNĐ
                              </span>
                            </div>
                          </div>

                          {/* Discount Percentage Input */}
                          <div className="space-y-2">
                            <Label htmlFor="discount-percent" className="flex items-center gap-2">
                              <Percent className="h-4 w-4 text-muted-foreground" />
                            </Label>
                            <div className="relative">
                              <Input
                                id="discount-percent"
                                type="number"
                                min="0"
                                max="100"
                                value={discountPercent}
                                onChange={(e) => handleDiscountChange(Number(e.target.value))}
                                className="pl-9"
                              />
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mt-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="price-slider" className="flex items-center gap-2">
                              <Percent className="h-4 w-4 text-muted-foreground" />
                              Điều chỉnh giá đề xuất
                            </Label>
                            <span className="text-sm text-muted-foreground">Giảm {discountPercent}%</span>
                          </div>
                          <Slider
                            id="price-slider"
                            min={0}
                            max={50}
                            step={1}
                            value={[discountPercent]}
                            onValueChange={(value) => handleDiscountChange(value[0])}
                            className="py-4"
                          />
                          <div className="flex items-center justify-between text-sm">
                            <span>0%</span>
                            <span>50%</span>
                          </div>
                        </div>

                        <div className="space-y-2 mt-6">
                          <Label htmlFor="message" className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            Lời nhắn đến khách hàng
                          </Label>
                          <Textarea
                            id="message"
                            placeholder="Nhập lời nhắn của bạn đến khách hàng..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-[120px]"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t pt-4">
                  {submitError && (
                    <div className="flex-1 text-destructive text-sm">{submitError}</div>
                  )}
                  <Button 
                    onClick={handleSubmitOffer} 
                    disabled={!selectedService || isSubmitting} 
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Gửi đề xuất
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Gói dịch vụ của bạn
              </CardTitle>
              <CardDescription>Chọn một gói dịch vụ để đề xuất cho khách hàng</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="px-4 py-2 space-y-4">
                  {services.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Package className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Bạn chưa có gói dịch vụ nào</p>
                      <Button variant="outline" size="sm" className="mt-4">
                        Tạo gói dịch vụ
                      </Button>
                    </div>
                  ) : (
                    services.map((service) => (
                      <Card
                        key={service.service_id}
                        className={cn(
                          "overflow-hidden cursor-pointer transition-all hover:border-primary",
                          selectedService?.service_id === service.service_id && "border-primary ring-1 ring-primary",
                        )}
                        onClick={() => handleServiceSelect(service)}
                      >
                        <div className="relative aspect-video">
                          <Image
                            src={service.thumbnail_url || "/placeholder.svg"}
                            alt={service.title}
                            fill
                            className="object-cover"
                          />
                          {selectedService?.service_id === service.service_id && (
                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                              <CheckCircle className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-1">{service.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-5 whitespace-pre-line break-words">{service.description}</p>
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-primary">{service.price.toLocaleString("vi-VN")} VNĐ</p>
                            <Button
                              size="sm"
                              variant={selectedService?.service_id === service.service_id ? "default" : "outline"}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleServiceSelect(service)
                              }}
                            >
                              {selectedService?.service_id === service.service_id ? "Đã chọn" : "Chọn"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Mẹo tạo đề xuất
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm">Đề xuất giá phù hợp với ngân sách của khách hàng</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm">Viết lời nhắn cá nhân hóa để tăng cơ hội được chọn</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm">Phản hồi nhanh chóng để thể hiện sự chuyên nghiệp</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* <Toaster /> */}
      <Toaster position="bottom-right">
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                {t.type !== "loading" && (
                  <button onClick={() => toast.dismiss(t.id)}>X</button>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
    </div>
  )
}
