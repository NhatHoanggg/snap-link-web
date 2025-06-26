"use client";

import { useEffect, useState } from "react";
import { getMyPaymentsHistory } from "@/services/payment.service";
import { Payment, PaymentType } from "@/services/payment.service";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await getMyPaymentsHistory();
      setPayments(data.payments);
      console.log(data)
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Không thể tải lịch sử thanh toán. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const getPaymentTypeText = (type: PaymentType) => {
    switch (type) {
      case PaymentType.DEPOSIT:
        return "Đặt cọc";
      case PaymentType.FULL:
        return "Thanh toán đầy đủ";
      case PaymentType.REMINDER:
        return "Thanh toán phần còn lại";
      default:
        return type;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Lịch sử thanh toán</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center text-destructive py-8">{error}</div>
      ) : payments.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          Chưa có lịch sử thanh toán nào
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Mã đặt lịch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Số tiền
                  </th>
                  
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Loại thanh toán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Mã đơn hàng
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Trạng thái
                  </th> */}
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {payments.map((payment) => (
                  <tr key={payment.payment_id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {payment.booking_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {format(new Date(payment.paid_at), "dd/MM/yyyy HH:mm", {
                        locale: vi,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {getPaymentTypeText(payment.payment_type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {payment.order_code}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'PAID' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {payment.status === 'PAID' ? 'Đã thanh toán' : 'Đã hủy'}
                      </span>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
