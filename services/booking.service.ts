import axiosInstance from "./axios"
export interface BookingFormData {
  photographer_id: number
  booking_date: string
  location_id: number
  custom_location: string
  quantity: number
  service_id: number
  shooting_type: string
  concept: string
  illustration_url: string
  availability_id: number
  discount_code: string
  total_price: number
  province: string
  photo_storage_link: string | null
  payment_status: string | null
}

export interface BookingResponse {
  booking_id: number
  customer_id: number
  photographer_id: number
  service_id: number
  booking_date: string
  location_id: number
  custom_location: string
  quantity: number
  shooting_type: string
  status: string
  created_at: string
  concept: string
  illustration_url: string
  availability_id: number
  booking_code: string
  total_price: number
  discount_code: string
  province: string
  photo_storage_link: string | null
  payment_status: string | null
}

export type PaymentStatus = 'unpaid' | 'deposit_paid' | 'fully_paid' | 'refunded';

export async function createBooking(booking: BookingFormData) {
  const response = await axiosInstance.post('/bookings', booking)
  return response.data
}

export async function getBookingByCode(code: string) {
  const response = await axiosInstance.get(`/bookings/${code}`)
  return response.data
}

export async function getMyBookings() {
  const response = await axiosInstance.get(`/bookings/me/all`)
  return response.data
}

export async function getMyBookingsByStatus(status: string) {
  const response = await axiosInstance.get(`/bookings/me/${status}`)
  return response.data
}

export async function getBookingById(id: number) {
  const response = await axiosInstance.get(`/bookings/${id}`)
  return response.data
}

export async function updateBooking(id: number, booking: BookingFormData) {
  const response = await axiosInstance.put(`/bookings/${id}`, booking)
  return response.data
}

export async function updateBookingStatus(id: number, status: string) {
  const response = await axiosInstance.patch(`/bookings/${id}/status`, { status })
  return response.data
}

export async function updatePaymentStatus(id: number, status: PaymentStatus) {
  const response = await axiosInstance.patch(`/bookings/${id}/payment-status`, {
    payment_status: status,
  })
  return response.data
}

export async function deleteBooking(id: number) {
  const response = await axiosInstance.delete(`/bookings/${id}`)
  return response.data
}

export async function uploadPhotoStorageLink(booking_id: number, photo_storage_link: string) {
  const response = await axiosInstance.patch(`/photographer/bookings/${booking_id}/photo-storage`, {
    photo_storage_link
  })
  return response.data
}