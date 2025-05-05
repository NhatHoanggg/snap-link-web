export interface FeaturedPhoto {
  featured_photo_id: number;
  image_url: string;
  title: string;
  description: string;
  uploaded_at: Date;
}

export interface FeaturedPhotoCreate {
  image_url: string;
  title: string;
  description: string;
}

export interface FeaturedPhotoUpdate {
  image_url: string;
  title: string;
  description: string;
}


import axiosInstance from "./axios"

export async function getFeaturedPhotos(): Promise<FeaturedPhoto[]> {
  try {
    const response = await axiosInstance.get("/photographers/portfolio/featured-photos")
    return response.data
  } catch (error) {
    console.error("Error fetching featured photos:", error)
    throw new Error("Failed to fetch featured photos")
  }
}

export async function createFeaturedPhoto(featuredPhoto: FeaturedPhotoCreate): Promise<FeaturedPhoto> {
  try {
    const response = await axiosInstance.post("/photographers/portfolio/featured-photos", featuredPhoto)
    return response.data
  } catch (error) {
    console.error("Error creating featured photo:", error)
    throw new Error("Failed to create featured photo")
  }
}

export async function updateFeaturedPhoto(featuredPhotoId: number, featuredPhoto: FeaturedPhotoUpdate): Promise<FeaturedPhoto> {
  try {
    const response = await axiosInstance.put(`/photographers/portfolio/featured-photos/${featuredPhotoId}`, featuredPhoto)
    return response.data
  } catch (error) {
    console.error("Error updating featured photo:", error)
    throw new Error("Failed to update featured photo")
  }
}

export async function deleteFeaturedPhoto(featuredPhotoId: number): Promise<void> {
  try {
    await axiosInstance.delete(`/photographers/portfolio/featured-photos/${featuredPhotoId}`)
  } catch (error) {
    console.error("Error deleting featured photo:", error)
    throw new Error("Failed to delete featured photo")
  }
}
