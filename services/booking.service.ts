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
}
  

export async function createBooking(booking: BookingFormData) {
  const response = await axiosInstance.post('/bookings', booking)
  return response.data
}

export async function getBookingByCode(code: string) {
  const response = await axiosInstance.get(`/bookings/${code}`)
  return response.data
}