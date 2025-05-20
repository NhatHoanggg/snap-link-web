import axiosInstance from "./axios";

export interface DiscountCreate {
    code: string,
    description: string,
    discount_type: "fixed" | "percent",
    value: number,
    max_uses: number,
    valid_from: string,
    valid_to: string,
    is_active: boolean
}

export interface Discount {
    code: string,
    description: string,
    discount_type: "fixed" | "percent",
    value: number,
    max_uses: number,
    valid_from: string,
    valid_to: string,
    is_active: boolean,
    id: number,
    current_uses: number
}

export interface PhotographerDiscountListResponse {
    total: number,
    discounts: PhotographerDiscount[]
}

export interface PhotographerDiscount {
    code: string,
    description: string,
    discount_type: "fixed" | "percent",
    value: number,
    max_uses: number,
    valid_from: string,
    valid_to: string,
    is_active: boolean,
    id: number,
    current_uses: number,
    is_saved: boolean,
    times_used: number
}
export interface DiscountResponse {
    total: number,
    discounts: Discount[]
}


export interface SavedDiscount {
    id: number,
    user_id: number,
    discount_id: number,
    times_used: number,
    photographer_id: number,
    discount: Discount
}
export interface SavedDiscountResponse {
    total: number,
    user_discounts: SavedDiscount[]
}

export async function getMyDiscount(): Promise<DiscountResponse> {
    try {
        const response = await axiosInstance.get("/photographer/discounts")
        return response.data
    } catch (error) {
        console.error("Error fetching discounts:", error)
        throw new Error("Failed to fetch discounts")
    }
}

export async function createDiscountPhotographer(discount: DiscountCreate): Promise<Discount> {
    try {
        const response = await axiosInstance.post("/photographer/discounts", discount)
        return response.data
    } catch (error) {
        console.error("Error creating discount:", error)
        throw new Error("Failed to create discount")
    }
}

export async function updateDiscount(id: number, discount: Partial<DiscountCreate>): Promise<Discount> {
    try {
        const response = await axiosInstance.patch(`/photographer/discounts/${id}`, discount)
        return response.data
    } catch (error) {
        console.error("Error updating discount:", error)
        throw new Error("Failed to update discount")
    }
}

export async function deleteDiscount(id: number): Promise<void> {
    try {
        await axiosInstance.delete(`/photographer/discounts/${id}`)
    } catch (error) {
        console.error("Error deleting discount:", error)
        throw new Error("Failed to delete discount")
    }
}

export async function getDiscountById(id: number): Promise<Discount> {
    try {
        const response = await axiosInstance.get(`/photographer/discounts/${id}`)
        return response.data
    } catch (error) {
        console.error("Error fetching discount:", error)
        throw new Error("Failed to fetch discount")
    }
}

export async function getPhotographerDiscounts(photographerId: number): Promise<PhotographerDiscountListResponse> {
    try {
        const response = await axiosInstance.get(`/api/photographers/${photographerId}/discounts`)
        return response.data
    } catch (error) {
        console.error("Error fetching photographer discounts:", error)
        throw new Error("Failed to fetch photographer discounts")
    }
}

// export async function saveDiscount(discountId: number): Promise<void> {
//     try {
//         await axiosInstance.post(`/photographer/discounts/${discountId}/save`)
//     } catch (error) {
//         console.error("Error saving discount:", error)
//         throw new Error("Failed to save discount")
//     }
// }

export async function saveDiscount(discount_code: string): Promise<void> {
    try {
        await axiosInstance.post(`/api/user/discounts`, { discount_code })
    } catch (error) {
        console.error("Error saving discount:", error)
        throw new Error("Failed to save discount")
    }
}

export async function getSavedDiscounts(): Promise<SavedDiscountResponse> {
    try {
        const response = await axiosInstance.get(`/api/user/discounts`)
        return response.data
    } catch (error) {
        console.error("Error fetching saved discounts:", error)
        throw new Error("Failed to fetch saved discounts")
    }
}

export async function validateDiscount(code: string): Promise<Discount> {
    try {
        const response = await axiosInstance.post(`/api/user/discounts/validate`, { code })
        return response.data
    } catch (error) {
        console.error("Error validating discount:", error)
        throw new Error("Failed to validate discount")
    }
}
