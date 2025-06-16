import axiosInstance from './axios';


export enum PaymentType {
  DEPOSIT = "deposit",
  FULL = "full",
  REMINDER = "reminder"
}

export interface PaymentRequest {
  amount:  number;  
  description: string,
  cancel_url : string,
  return_url : string
}

export interface CreateHistory{
  booking_code: string,
  amount: number,
  payment_type: PaymentType,
  order_code:  string,
  status:  string,
}
export interface Payment {
  booking_code:  string,
  amount: number,
  payment_type:  PaymentType,
  order_code: string,
  status: string,
  payment_id: string,
  user_id:  number,
  paid_at:  string,
}

export interface PaymentListResponse {
  total: number;
  payments: Payment[];
}


export async function createPayment(paymentData: PaymentRequest) {
  try {
    const response = await axiosInstance.post('/create-payment', paymentData);
    return response.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw new Error("Failed to create payment");
  }
}

export async function createHistory(data: CreateHistory) {
  try {
    const response = await axiosInstance.post('/history', data);
    return response.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw new Error("Failed to create payment");
  }
}

export async function getMyPaymentsHistory() {
  try {
    const response = await axiosInstance.get('/me/payment/history')
    return response.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw new Error("Failed to create payment");
  }
}



// export async function getMyPaymentsHistory(order: string): Promise<PaymentListResponse> {
//   try {
//     const response = await axiosInstance.get(`/payments/me?sort_order=${order}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error getting my payments history:", error);
//     throw new Error("Failed to get my payments history");
//   }
// }