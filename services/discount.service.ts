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

export interface DiscountResponse {
    total: number,
    discounts: Discount[]
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