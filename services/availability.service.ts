export interface Availability {
  available_date: string
  status: "available" | "booked"
  availability_id: number
  created_at: string
}

export interface CreateAvailabilityRequest {
  available_date: string,
  status: "available"
}

export interface UpdateAvailabilityRequest {
  available_date: string,
  status: "available" | "booked"
}

import axiosInstance from "./axios"

export async function getAvailabilities(): Promise<Availability[]> {
  try {
    const response = await axiosInstance.get("/photographers/me/availability")
    return response.data
  } catch (error) {
    console.error("Error fetching availabilities:", error)
    throw new Error("Failed to fetch availabilities")
  }
}

export async function createAvailability(date: string): Promise<Availability> {
  try {
    const response = await axiosInstance.post("/photographers/me/availability", {
      available_date: date,
      status: "available"
    })
    return response.data
  } catch (error) {
    console.error("Error creating availability:", error)
    throw new Error("Failed to create availability")
  }
}

export async function updateAvailability(availabilityId: number, status: "available" | "booked"): Promise<Availability> {
  try {
    const response = await axiosInstance.put(`/photographers/me/availability/${availabilityId}`, {
      status
    })
    return response.data
  } catch (error) {
    console.error("Error updating availability:", error)
    throw new Error("Failed to update availability")
  }
}

export async function deleteAvailability(availabilityId: number): Promise<void> {
  try {
    await axiosInstance.delete(`/photographers/me/availability/${availabilityId}`)
  } catch (error) {
    console.error("Error deleting availability:", error)
    throw new Error("Failed to delete availability")
  }
}
