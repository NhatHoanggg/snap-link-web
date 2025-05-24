"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBookingByCode } from "@/services/booking.service";
import { createMomoPayment, MomoPaymentType } from "@/services/payment.service";
import { BookingResponse } from "@/services/booking.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Loader2, CreditCard, Wallet } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function PaymentPage() {
  const params = useParams();
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const code = params.code as string;
        const data = await getBookingByCode(code);
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

  const handleMomoPayment = async (paymentType: MomoPaymentType) => {
    if (!booking) return;

    try {
      setPaymentLoading(true);
      const paymentData = {
        amount: booking.total_price,
        order_id: generateOrderId(),
        order_info: `${booking.booking_code}`,
        return_url: `http://localhost:3000/payment/success`,
        notify_url: `http://127.0.0.1:8001/api/payment/momo/callback`,
        payment_type: paymentType,
      };

      const response = await createMomoPayment(paymentData);
      
      // Redirect to MoMo payment page
      if (response.payUrl) {
        window.location.href = response.payUrl;
      } else if (response.deeplink) {
        window.location.href = response.deeplink;
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Không thể tạo thanh toán. Vui lòng thử lại sau.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `SNAP_${timestamp}_${random}`;
  }

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
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium">Tổng tiền:</span>
                <span className="text-2xl font-bold text-primary">
                  {booking.total_price.toLocaleString("vi-VN")} VNĐ
                </span>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full"
                  onClick={() => handleMomoPayment(MomoPaymentType.CAPTURE_WALLET)}
                  disabled={paymentLoading}
                >
                  {paymentLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Wallet className="w-4 h-4 mr-2" />
                  )}
                  Thanh toán qua ví MoMo
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleMomoPayment(MomoPaymentType.PAY_WITH_ATM)}
                  disabled={paymentLoading}
                >
                  {paymentLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CreditCard className="w-4 h-4 mr-2" />
                  )}
                  Thanh toán qua ATM
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}