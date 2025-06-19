import axiosInstance from "./axios";

export interface Follower{
    user_id: number;
    full_name: string;
    email: string;
    phone_number: string;
    role: string;
    avatar: string;
    background_image: string;
    province: string;
    district: string;
    ward: string;
    address_detail: string;
    slug: string
}

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


export async function getMyFollowers(): Promise<Follower[]> {
    try {
        const response = await axiosInstance.get(`/me/followers`)
        return response.data
    } catch (error) {
        console.error("Error getting followers:", error)
        throw new Error("Error getting followers:")
    }
}

export async function getMyFollowing(): Promise<Follower[]> {
    try {
        const response = await axiosInstance.get(`/me/following`)
        return response.data
    } catch (error) {
        console.error("Error getting following:", error)
        throw new Error("Error getting following")
    }
}




