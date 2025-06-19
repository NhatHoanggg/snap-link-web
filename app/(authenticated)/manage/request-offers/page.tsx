"use client"

import { useEffect, useState } from "react"
import { getMyOffers, deleteOffer, type OfferResponse } from "@/services/offer.service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
import toast, { Toaster } from "react-hot-toast"
import { format } from "date-fns"
import { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { Eye, Trash2, Clock, CheckCircle, XCircle, DollarSign, MessageSquare, Calendar } from "lucide-react"

export default function RequestOffersPage() {
  const [offers, setOffers] = useState<OfferResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const router = useRouter()

  const fetchOffers = async () => {
    try {
      const data = await getMyOffers()
      setOffers(data)
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Không thể tải danh sách đề xuất")
      } else {
        toast.error("Không thể tải danh sách đề xuất")
      }
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (requestOfferId: number) => {
    setDeletingId(requestOfferId)
    try {
      await deleteOffer(requestOfferId)
      toast.success("Xóa đề xuất thành công")
      fetchOffers()
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Không thể xóa đề xuất")
      } else {
        toast.error("Không thể xóa đề xuất. Vui lòng thử lại.")
      }
      console.error(error)
    } finally {
      setDeletingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã chấp nhận
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Đã từ chối
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Đang chờ
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusStats = () => {
    const stats = offers.reduce(
      (acc, offer) => {
        acc[offer.status] = (acc[offer.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      total: offers.length,
      pending: stats.pending || 0,
      accepted: stats.accepted || 0,
      rejected: stats.rejected || 0,
    }
  }

  useEffect(() => {
    fetchOffers()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Đang tải danh sách đề xuất...</p>
          </div>
        </div>
      </div>
    )
  }

  const stats = getStatusStats()

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Đề xuất của tôi</h1>
          <p className="text-muted-foreground">Quản lý và theo dõi tất cả các đề xuất dịch vụ của bạn</p>
        </div>

        {/* Stats Cards */}
        {offers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng cộng</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Đang chờ</p>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Đã chấp nhận</p>
                    <p className="text-2xl font-bold">{stats.accepted}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Đã từ chối</p>
                    <p className="text-2xl font-bold">{stats.rejected}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Offers List */}
      {offers.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chưa có đề xuất nào</h3>
              <p className="text-muted-foreground mb-4">
                Bạn chưa tạo đề xuất nào. Hãy bắt đầu bằng cách tạo đề xuất đầu tiên của bạn.
              </p>
              <Button onClick={() => router.push("/services")}>Khám phá dịch vụ</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {offers.map((offer) => (
            <Card key={offer.request_offer_id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">Đề xuất #{offer.request_offer_id}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(offer.created_at), "dd/MM/yyyy")}
                      </span>
                      <span>Service ID: {offer.service_id}</span>
                    </div>
                  </div>
                  {getStatusBadge(offer.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Giá đề xuất</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">${offer.custom_price}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Tin nhắn</span>
                    </div>
                    <p className="text-sm bg-muted p-3 rounded-lg">{offer.message || "Không có tin nhắn"}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/manage/request-offers/${offer.request_offer_id}`)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Xem chi tiết
                    </Button>
                  </div>

                  {offer.status === "pending" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deletingId === offer.request_offer_id}
                          className="flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          {deletingId === offer.request_offer_id ? "Đang xóa..." : "Xóa"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xác nhận xóa đề xuất</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa đề xuất này không? Hành động này không thể hoàn tác.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(offer.request_offer_id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Xóa đề xuất
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}

                  {offer.status !== "pending" && (
                    <div className="text-sm text-muted-foreground">
                      {offer.status === "accepted" ? "Đề xuất đã được chấp nhận" : "Đề xuất đã bị từ chối"}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Toaster position="bottom-right" />
    </div>
  )
}
