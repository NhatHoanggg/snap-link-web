
import axiosInstance from "./axios";

export interface Tag {
    name: string;
}

export async function getTags(type: string){
    const response = await axiosInstance.get(`/tags?skip=0&limit=100&type=${type}`)
    return response.data
}