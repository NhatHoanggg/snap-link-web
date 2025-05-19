import axiosInstance from "./axios";

export async function followPhotographer(photographerId: number) {
    try {
        const response = await axiosInstance.post(`/photographers/${photographerId}/follow`)
        return response.data
    } catch (error) {
        console.error("Error following photographer:", error)
        throw new Error("Failed to follow photographer")
    }
}

export async function unfollowPhotographer(photographerId: number) {
    try {
        const response = await axiosInstance.delete(`/photographers/${photographerId}/follow`)
        return response.data
    } catch (error) {
        console.error("Error unfollowing photographer:", error)
        throw new Error("Failed to unfollow photographer")
    }
}

export async function checkFollowStatus(photographerId: number) {
    try {
        const response = await axiosInstance.get(`/photographers/${photographerId}/follow-status`)
        return response.data
    } catch (error) {
        console.error("Error checking follow status:", error)
        throw new Error("Failed to check follow status")
    }
}

