"use client"

import { useEffect, useState } from "react"
import { getOfferDetail, type OfferDetailResponse, changeOfferStatus } from "@/services/offer.service"
import { format } from "date-fns"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Camera, CheckCircle, Clock, MessageSquare, Package, Tag, AlertCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

export default function OfferDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [offer, setOffer] = useState<OfferDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const fetchOfferDetail = async () => {
      try {
        const data = await getOfferDetail(Number(params.request_offer_id))
        setOffer(data)
      } catch (err) {
        setError("Không thể tải thông tin đề xuất")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOfferDetail()
  }, [params.request_offer_id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !offer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-destructive text-lg font-medium">{error || "Không tìm thấy thông tin đề xuất"}</div>
        <Button variant="outline" onClick={() => router.back()}>
          Quay lại
        </Button>
      </div>
    )
  }

  // Calculate discount percentage
  const servicePrice = offer.service_price
  const discountPercentage = servicePrice > 0 ? Math.round(100 - (offer.custom_price / servicePrice) * 100) : 0

  // Format the description with line breaks
  const formattedDescription = offer.service_description.split("\n").map((line, index) => (
    <span key={index} className="block">
      {line}
    </span>
  ))

  const handleStatusChange = async (status: "accepted" | "rejected") => {
    if (!offer) return;
    
    setIsUpdating(true);
    try {
      await changeOfferStatus(offer.request_offer_id, { status });
      toast.success(status === "accepted" ? "Đã chấp nhận đề xuất" : "Đã từ chối đề xuất");
      router.push(`/my-booking/requests/${params.id}`);
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link
          href={`/my-booking/requests/${params.id}`}
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Quay lại yêu cầu
        </Link>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className={cn(
                  "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
                  "flex items-center gap-1.5",
                )}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                Đang chờ xác nhận
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Trạng thái: {offer.status}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Photographer Info Card */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Thông tin nhiếp ảnh gia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                <AvatarImage src={offer.photographer_avatar || "/placeholder.svg"} alt={offer.photographer_name} />
                <AvatarFallback>{offer.photographer_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-xl mt-4">{offer.photographer_name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Đề xuất vào {format(new Date(offer.created_at), "dd/MM/yyyy")}</span>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-sm mb-2">Lời nhắn từ nhiếp ảnh gia:</h4>
                  <p className="text-sm text-muted-foreground">{offer.message}</p>
                </div>
              </div>
            </div>

            <div className="w-full">
              <Link
                href={`/photographers/${offer.photographer_slug}`}
                className="w-full inline-flex justify-center items-center text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Xem hồ sơ nhiếp ảnh gia
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Service Details Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Chi tiết dịch vụ</CardTitle>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Camera className="w-3.5 h-3.5" />
                Dịch vụ #{offer.service_id}
              </Badge>
            </div>
            <CardDescription>Thông tin chi tiết về dịch vụ được đề xuất</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Service Image */}
              {offer.service_thumbnail_url && (
                <div className="md:w-1/3 flex-shrink-0">
                  <div className="relative aspect-square overflow-hidden rounded-lg border">
                    <img
                      src={offer.service_thumbnail_url || "/placeholder.svg"}
                      alt={offer.service_title}
                      className="object-cover w-full h-full transition-transform hover:scale-105"
                    />
                  </div>
                </div>
              )}

              {/* Service Info */}
              <div className={cn("flex-1", !offer.service_thumbnail_url && "md:w-full")}>
                <h3 className="text-xl font-semibold mb-4">{offer.service_title}</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Package className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm">Mô tả dịch vụ:</h4>
                      <p className="text-sm text-muted-foreground mt-1">{formattedDescription}</p>
                    </div>
                  </div>

                  {/* <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm">Thời gian:</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Liên hệ với nhiếp ảnh gia để thảo luận lịch trình
                      </p>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>

            <Separator />

            {/* Pricing Section */}
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-primary" />
                    <h4 className="font-medium">Chi phí dịch vụ</h4>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">
                      {new Intl.NumberFormat("vi-VN").format(offer.custom_price)} VND
                    </span>
                    {discountPercentage > 0 && (
                      <span className="text-sm line-through text-muted-foreground">
                        {new Intl.NumberFormat("vi-VN").format(servicePrice)} VND
                      </span>
                    )}
                  </div>
                </div>

                {discountPercentage > 0 && (
                  <div className="flex items-center">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                      Giảm {discountPercentage}%
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4 pt-2 border-t">
            <Button variant="outline" onClick={() => router.back()}>
              Quay lại
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <XCircle className="w-4 h-4" />
                  Từ chối
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận từ chối đề xuất</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn từ chối đề xuất này? Hành động này không thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleStatusChange("rejected")}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isUpdating}
                  >
                    Xác nhận từ chối
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="gap-2" disabled={isUpdating}>
                  <CheckCircle className="w-4 h-4" />
                  Chấp nhận đề xuất
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận chấp nhận đề xuất</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn chấp nhận đề xuất này? 
                    {/* Sau khi chấp nhận, bạn sẽ được chuyển đến trang thanh toán. */}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleStatusChange("accepted")}
                    disabled={isUpdating}
                  >
                    Xác nhận chấp nhận
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
