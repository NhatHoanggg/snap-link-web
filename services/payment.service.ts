import axiosInstance from './axios';

export enum MomoPaymentType {
  CAPTURE_WALLET = "captureWallet",  // Thanh toán qua ví MoMo
  PAY_WITH_ATM = "payWithATM",       // Thanh toán qua ATM
  PAY_WITH_CC = "payWithCC"          // Thanh toán qua thẻ quốc tế
}

export enum PaymentType {
  DEPOSIT = "deposit",
  FULL = "full",
  REFUNDED = "refunded"
}

export enum PaymentMethod {
  CARD = "card",
  CASH = "cash",
  MOBILE = "mobile",
  BANK_TRANSFER = "bank_transfer"
}

export interface PaymentRequest {
  booking_id: number;
  amount: number;
  payment_type: PaymentType;
  transaction_id: string;
  payment_method: PaymentMethod;
  info: string;
}

export interface Payment {
  payment_id: number;
  booking_id: number;
  user_id: number;
  paid_at: string;
  amount: number;
  payment_type: PaymentType;
  payment_method: PaymentMethod;
  transaction_id: string;
  info: string;
}

export interface PaymentListResponse {
  total: number;
  payments: Payment[];
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
    const response = await axiosInstance.post(`/api/payment/momo/create`, paymentData);
    return response.data;
  } catch (error) {
    console.error("Error creating momo payment:", error)
    throw new Error("Failed to create momo payment")
  }
}; 

export const handleMomoPaymentCallback = async (partnerCode: string, orderId: string, requestId: string, amount: number, orderInfo: string, orderType: string, transId: string, resultCode: number, message: string, payType: string, responseTime: number, signature: string): Promise<MomoPaymentResponse> => {
  try {
    const response = await axiosInstance.post(`/api/payment/momo/callback/${partnerCode}/${orderId}/${requestId}/${amount}/${orderInfo}/${orderType}/${transId}/${resultCode}/${message}/${payType}/${responseTime}/${signature}`);
    return response.data;
  } catch (error) {
    console.error("Error handling momo payment callback:", error)
    throw new Error("Failed to handle momo payment callback")
  }
};

export async function createPayment(paymentData: PaymentRequest) {
  try {
    const response = await axiosInstance.post('/payments', paymentData);
    return response.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw new Error("Failed to create payment");
  }
}

export async function getMyPaymentsHistory(order: string): Promise<PaymentListResponse> {
  try {
    const response = await axiosInstance.get(`/payments/me?sort_order=${order}`);
    return response.data;
  } catch (error) {
    console.error("Error getting my payments history:", error);
    throw new Error("Failed to get my payments history");
  }
}