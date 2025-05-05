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

export async function getMockServices(): Promise<Service[]> {
    return [
      {
        title: "Gói 1: Chụp ảnh Hội An",
        thumbnail_url:
          "https://images.unsplash.com/photo-1652731011413-93d4c5aa5c7c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fEglRTElQkIlOTlpJTIwQW58ZW58MHwwfDB8fHwy",
        price: 900000.0,
        description: "Chụp chill chill 3",
        is_active: true,
        service_id: 1,
        photographer_id: 14,
        created_at: "2025-04-29T07:09:06.774565Z",
        updated_at: null,
      },
      {
        title: "Gói 2: Chụp Chill Chill 3",
        thumbnail_url:
          "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: 900000.0,
        description: "Chụp chill chill 3",
        is_active: true,
        service_id: 2,
        photographer_id: 14,
        created_at: "2025-05-04T07:26:42.496230Z",
        updated_at: null,
      },
      {
        title: "Gói 3: Chụp ảnh cưới",
        thumbnail_url:
          "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: 1500000.0,
        description: "Chụp ảnh cưới tại Hội An",
        is_active: true,
        service_id: 3,
        photographer_id: 14,
        created_at: "2025-05-04T07:27:22.883884Z",
        updated_at: null,
      },
      {
        title: "Gói 4: Chụp ảnh gia đình",
        thumbnail_url:
          "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: 1200000.0,
        description: "Chụp ảnh gia đình tại studio hoặc ngoại cảnh",
        is_active: true,
        service_id: 4,
        photographer_id: 14,
        created_at: "2025-05-04T07:44:13.291108Z",
        updated_at: "2025-05-04T07:53:35.683998Z",
      },
    ]
  }
  



