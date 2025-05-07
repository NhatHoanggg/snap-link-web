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

export async function getAvailabilitiesBySlug(slug: string): Promise<Availability[]> {
  try {
    const response = await axiosInstance.get(`/photographers/slug/${slug}/availability`)
    return response.data
  } catch (error) {
    console.error("Error fetching availability by slug:", error)
    throw new Error("Failed to fetch availability by slug")
  }
}

export async function getMockAvailabilities(): Promise<Availability[]> {
  return [
    {
      available_date: "2025-05-10",
      status: "available",
      availability_id: 6,
      created_at: "2025-04-29T16:29:18.821982Z",
    },
    {
      available_date: "2025-05-11",
      status: "available",
      availability_id: 7,
      created_at: "2025-04-29T16:29:41.975343Z",
    },
    {
      available_date: "2025-05-12",
      status: "booked",
      availability_id: 8,
      created_at: "2025-04-29T16:29:50.208842Z",
    },
    {
      available_date: "2025-05-13",
      status: "available",
      availability_id: 9,
      created_at: "2025-04-29T16:29:58.588843Z",
    },
    {
      available_date: "2025-05-18",
      status: "available",
      availability_id: 10,
      created_at: "2025-05-04T10:03:48.153007Z",
    },
    {
      available_date: "2025-05-21",
      status: "available",
      availability_id: 12,
      created_at: "2025-05-04T10:34:18.040198Z",
    },
    {
      available_date: "2025-05-22",
      status: "available",
      availability_id: 13,
      created_at: "2025-05-04T10:36:15.263025Z",
    },
  ]
}