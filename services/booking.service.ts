export interface BookingFormData {
    date?: Date
    service: string
    shootingType: "studio" | "outdoor"
    location: string
    customLocation?: string
    locationDetails?: string
    locationNotes?: string
    package: string
    concept: string
    illustrations: string[]
  }
  
  export interface Package {
    id: string
    name: string
    price: number
    description: string
    features: string[]
  }