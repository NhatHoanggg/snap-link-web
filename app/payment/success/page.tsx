'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Calendar, Camera, MapPin, MapPinned, ChevronDown, ChevronUp } from "lucide-react";
import { getBookingByCode, updateBookingStatus, updatePaymentStatus, type BookingResponse, type PaymentStatus } from '@/services/booking.service';
import { createPayment, PaymentType, PaymentMethod } from '@/services/payment.service';
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import toast, { Toaster } from 'react-hot-toast';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showBookingInfo, setShowBookingInfo] = useState(false);

  const resultCode = searchParams.get('resultCode');
  const bookingCode = searchParams.get('orderInfo')?.split('_')[0];
  const paymentOption = searchParams.get('orderInfo')?.split('_')[1];
  const message = searchParams.get('message');
  const amount = searchParams.get('amount');
  const transId = searchParams.get('transId');
  const payType = searchParams.get('payType');

  // Helper function to get payment type information
  const getPaymentTypeInfo = () => {
    switch (paymentOption) {
      case 'full':
        return {
          title: 'Thanh toán toàn bộ',
          description: 'Bạn đã thanh toán 100% giá trị đặt lịch',
          percentage: 100
        };
      case 'deposit':
        return {
          title: 'Thanh toán đặt cọc',
          description: 'Bạn đã thanh toán 20% giá trị đặt lịch',
          percentage: 20
        };
      case 'reminder':
        return {
          title: 'Thanh toán phần còn lại',
          description: 'Bạn đã thanh toán 80% giá trị đặt lịch còn lại',
          percentage: 80
        };
      default:
        return {
          title: 'Thanh toán',
          description: 'Thông tin thanh toán',
          percentage: 0
        };
    }
  };

  const paymentInfo = getPaymentTypeInfo();

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingCode) {
        setError('Không tìm thấy mã đặt lịch');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const bookingData = await getBookingByCode(bookingCode);
        setBooking(bookingData);

        // If payment is successful, update booking status
        if (resultCode === '0') {
          try {
            const newStatus = 'confirmed';
            let newPaymentStatus: PaymentStatus = 'fully_paid'; // Mặc định là fully_paid
            let paymentType: PaymentType = PaymentType.FULL;

            if (paymentOption === 'deposit') {
              newPaymentStatus = 'deposit_paid';
              paymentType = PaymentType.DEPOSIT;
            } else if (paymentOption === 'reminder') {
              newPaymentStatus = 'fully_paid';
              paymentType = PaymentType.FULL;
            }

            // Update booking status
            await updateBookingStatus(bookingData.booking_id, newStatus);
            await updatePaymentStatus(bookingData.booking_id, newPaymentStatus);

            // Create payment record
            const orderInfo = searchParams.get('orderInfo');
            const paymentData = {
              booking_id: bookingData.booking_id,
              amount: Number(amount),
              payment_type: paymentType,
              transaction_id: transId || '',
              payment_method: payType === 'momo_wallet' ? PaymentMethod.MOBILE : PaymentMethod.CARD,
              info: orderInfo || ''
            };

            await createPayment(paymentData);
            
            // Update local booking state with new status
            setBooking(prev => prev ? { 
              ...prev, 
              status: newStatus,
              payment_status: newPaymentStatus 
            } : null);
            
            toast.success('Thanh toán thành công!');
          } catch (err) {
            console.error('Error updating booking status:', err);
            toast.error('Không thể cập nhật trạng thái đặt lịch');
          }
        }
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Không thể tải thông tin đặt lịch');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingCode, resultCode, paymentOption, amount, transId, payType, searchParams]);

  const isSuccess = resultCode === '0';

  // Helper function to translate payment type
  const translatePaymentType = (type: string | null) => {
    switch (type) {
      case 'napas':
        return 'Thẻ ATM';
      case 'momo_wallet':
        return 'Ví MoMo';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="container max-w-md mx-auto py-12">
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
            </div>
            <CardTitle className="text-center">Đang tải thông tin...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-md mx-auto py-12">
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-center text-red-500">Lỗi</CardTitle>
            <CardDescription className="text-center">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/')}
            >
              Về trang chủ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto py-12">
      <Toaster position="bottom-center" />
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            {isSuccess ? (
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <CardTitle className="text-center">
            {isSuccess ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
          </CardTitle>
          <CardDescription className="text-center">
            {isSuccess 
              ? paymentInfo.description
              : message || 'Có lỗi xảy ra trong quá trình thanh toán.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Thông tin thanh toán</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mã đặt lịch:</span>
                <span className="font-medium">{bookingCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loại thanh toán:</span>
                <span className="font-medium">{paymentInfo.title}</span>
              </div>
              {amount && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số tiền đã thanh toán:</span>
                  <span className="font-medium">{Number(amount).toLocaleString()} VND</span>
                </div>
              )}
              {payType && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phương thức:</span>
                  <span className="font-medium capitalize">{translatePaymentType(payType)}</span>
                </div>
              )}
              {transId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã giao dịch:</span>
                  <span className="font-medium">{transId}</span>
                </div>
              )}
            </div>

            {/* Payment Summary */}
            {booking && (
              <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                <h4 className="font-medium mb-2">Tóm tắt thanh toán</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tổng giá trị đặt lịch:</span>
                    <span className="font-medium">{booking.total_price.toLocaleString()} VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Đã thanh toán:</span>
                    <span className="font-medium text-green-600">
                      {paymentInfo.percentage}% ({Number(amount).toLocaleString()} VND)
                    </span>
                  </div>
                  {paymentOption === 'deposit' && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Còn lại:</span>
                      <span className="font-medium text-orange-600">
                        80% ({Math.round(booking.total_price * 0.8).toLocaleString()} VND)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Booking Information Toggle Button */}
          {booking && (
            <Button
              variant="outline"
              className="w-full flex items-center justify-between"
              onClick={() => setShowBookingInfo(!showBookingInfo)}
            >
              <span>Thông tin đặt lịch</span>
              {showBookingInfo ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* Booking Information */}
          {booking && showBookingInfo && (
            <div className="space-y-4 pt-2 border-t">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Ngày chụp</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(booking.booking_date), "EEEE, dd/MM/yyyy", { locale: vi })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Camera className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Concept</h4>
                    <p className="text-sm text-muted-foreground">{booking.concept}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Tỉnh/Thành phố</h4>
                    <p className="text-sm text-muted-foreground">
                      {booking.province || "Chưa có thông tin địa điểm"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <MapPinned className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Địa điểm</h4>
                    <p className="text-sm text-muted-foreground">
                      {booking.custom_location || "Chưa có thông tin địa điểm"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 space-y-2">
            {booking && (
              <Button
                className="w-full"
                onClick={() => router.push(`/my-booking/bookings/${booking.booking_code}`)}
              >
                Xem chi tiết đặt lịch
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/')}
            >
              Về trang chủ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}