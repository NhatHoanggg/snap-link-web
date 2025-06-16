"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBookingByCode } from "@/services/booking.service";
import { BookingResponse } from "@/services/booking.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Loader2, CreditCard } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPayment } from "@/services/payment.service";

export default function PaymentPage() {
  const params = useParams();
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentOption, setPaymentOption] = useState<"full" | "deposit">("full");

  // Tính toán số tiền cần thanh toán dựa trên lựa chọn
  const calculatePaymentAmount = () => {
    if (!booking) return 0;

    if (booking.status === "accepted" && booking.payment_status === "unpaid") {
      return paymentOption === "deposit"
        ? Math.round(booking.total_price * 0.2) // 20% đặt cọc
        : booking.total_price; // Thanh toán toàn bộ
    } else if (booking.status === "confirmed" && booking.payment_status === "deposit_paid") {
      return Math.round(booking.total_price * 0.8); // 80% còn lại
    }

    return booking.total_price;
  };

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const code = params.code as string;
        const data = await getBookingByCode(code);
        console.log(data)
        setBooking(data);
      } catch (error) {
        console.error("Error fetching booking:", error);
        toast.error("Không thể tải thông tin đặt lịch");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [params.code]);

  const handlePayment = async () => {
    if (!booking) return;

    try {
      setPaymentLoading(true);
      const amount = calculatePaymentAmount();
      const description = `${booking.booking_code}`;

      const paymentData = {
        amount: amount,
        description: description,
        cancel_url: `https://snaplink.io.vn/payment/${booking.booking_code}`,
        return_url: `https://snaplink.io.vn/payment/success?booking_code=${booking.booking_code}&payment_type=${paymentOption}`
      };

      const response = await createPayment(paymentData);
      // console.log(response)
      
      // Redirect to payment page
      if (response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      }

    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Không thể tạo thanh toán. Vui lòng thử lại sau.");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Không tìm thấy thông tin đặt lịch</p>
      </div>
    );
  }

  const paymentAmount = calculatePaymentAmount();

  return (
    <div className="container max-w-2xl py-8 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Thanh toán đặt lịch</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm font-medium">Mã đặt lịch: {booking.booking_code}</p>
              <p className="text-sm text-muted-foreground">
                Ngày chụp: {format(new Date(booking.booking_date), "EEEE, dd MMMM yyyy", { locale: vi })}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Thông tin đặt lịch</h3>
              <div className="grid gap-2 text-sm">
                <p><span className="text-muted-foreground">Loại hình:</span> {booking.shooting_type === "outdoor" ? "Ngoại cảnh" : "Studio"}</p>
                <p><span className="text-muted-foreground">Tỉnh/Thành phố:</span> {booking.province}</p>
                <p><span className="text-muted-foreground">Địa điểm:</span> {booking.custom_location || "Studio"}</p>
                <p><span className="text-muted-foreground">Concept:</span> {booking.concept}</p>
                {booking.illustration_url && (
                  <div className="relative w-full h-48 rounded-md overflow-hidden mt-2">
                    <Image
                      src={booking.illustration_url}
                      alt="Ảnh tham khảo"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              {/* Hiển thị tổng tiền */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-base text-muted-foreground">Tổng tiền dịch vụ:</span>
                <span className="text-lg font-medium">
                  {booking.total_price.toLocaleString("vi-VN")} VNĐ
                </span>
              </div>

              {booking.status === "accepted" && booking.payment_status === "unpaid" && (
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">Chọn hình thức thanh toán:</label>
                  <Select
                    value={paymentOption}
                    onValueChange={(value: "full" | "deposit") => setPaymentOption(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn hình thức thanh toán" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">
                        <div className="flex justify-between items-center w-full">
                          <span>Thanh toán toàn bộ</span>
                          <span className="ml-4 font-medium">
                            {booking.total_price.toLocaleString("vi-VN")} VNĐ
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="deposit">
                        <div className="flex justify-between items-center w-full">
                          <span>Thanh toán 20% (đặt cọc)</span>
                          <span className="ml-4 font-medium">
                            {Math.round(booking.total_price * 0.2).toLocaleString("vi-VN")} VNĐ
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Hiển thị số tiền cần thanh toán */}
              <div className="flex justify-between items-center mb-6 p-4 bg-primary/10 rounded-lg">
                <span className="text-lg font-semibold">Số tiền cần thanh toán:</span>
                <span className="text-2xl font-bold text-primary">
                  {paymentAmount.toLocaleString("vi-VN")} VNĐ
                </span>
              </div>

              {/* Hiển thị thông tin chi tiết cho trường hợp đã đặt cọc */}
              {booking.status === "confirmed" && booking.payment_status === "deposit_paid" && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Lưu ý:</strong> Bạn đã thanh toán 20% đặt cọc. Số tiền còn lại cần thanh toán là 80%.
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    Đã thanh toán: {Math.round(booking.total_price * 0.2).toLocaleString("vi-VN")} VNĐ
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Button
                  className="w-full"
                  onClick={handlePayment}
                  disabled={paymentLoading}
                >
                  {paymentLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CreditCard className="w-4 h-4 mr-2" />
                  )}
                  Thanh toán {paymentAmount.toLocaleString("vi-VN")} VNĐ
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
