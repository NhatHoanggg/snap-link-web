import axiosInstance from './axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export enum MomoPaymentType {
  CAPTURE_WALLET = "captureWallet",  // Thanh toán qua ví MoMo
  PAY_WITH_ATM = "payWithATM",       // Thanh toán qua ATM
  PAY_WITH_CC = "payWithCC"          // Thanh toán qua thẻ quốc tế
}

export interface MomoPaymentRequest {
  amount: number;
  order_id: string;
  order_info: string;
  return_url: string;
  notify_url: string;
  payment_type?: MomoPaymentType;  // Thêm phương thức thanh toán
}

export interface MomoPaymentResponse {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: number;
  payUrl: string;
  deeplink?: string;
  qrCodeUrl?: string;
}

export const createMomoPayment = async (paymentData: MomoPaymentRequest): Promise<MomoPaymentResponse> => {
  try {
    const response = await axiosInstance.post(`${API_URL}/api/payment/momo/create`, paymentData);
    return response.data;
  } catch (error) {
    console.error("Error creating momo payment:", error)
    throw new Error("Failed to create momo payment")
  }
}; 