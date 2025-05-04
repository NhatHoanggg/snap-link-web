import axiosInstance from './axios'

export interface Service {
    title: string
    thumbnail_url: string
    price: number
    description: string
    is_active: boolean
    service_id: number
    photographer_id: number
    created_at: string
    updated_at: string | null
}

export async function getServices(): Promise<Service[]> {
    try {
        const response = await axiosInstance.get('/photographers/me/services')
        return response.data
    } catch (error) {
        console.error('Error fetching services:', error)
        return []
    }
}

export async function getServiceById(serviceId: number): Promise<Service> {
    try {
        const response = await axiosInstance.get(`/photographers/me/services/${serviceId}`)
        return response.data
    } catch (error) {
        console.error('Error fetching service by id:', error)
        throw error
    }
}

export async function createService(service: Service): Promise<Service> {
    try {
        const response = await axiosInstance.post('/photographers/me/services', service)
        return response.data
    } catch (error) {
        console.error('Error creating service:', error)
        throw error
    }
}

export async function updateService(serviceId: number, service: Service): Promise<Service> {
    try {
        const response = await axiosInstance.put(`/photographers/me/services/${serviceId}`, service)
        return response.data
    } catch (error) {
        console.error('Error updating service:', error)
        throw error
    }
}

export async function deleteService(serviceId: number): Promise<void> {
    try {       
        await axiosInstance.delete(`/photographers/me/services/${serviceId}`)
    } catch (error) {
        console.error('Error deleting service:', error)
        throw error
    }
}



