
import axiosInstance from "./axios";

export interface Tag {
    name: string;
}

export async function getTags(type: string | null) {
    const baseUrl = '/tags?skip=0&limit=100';
    const url = type ? `${baseUrl}&type=${type}` : baseUrl;
    
    const response = await axiosInstance.get(url);
    return response.data;
}
