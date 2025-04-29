// app/page.tsx hoặc trang bất kỳ
"use client"

import { useState } from "react"
import LocationSelector from "@/components/common/location-selector"

interface Ward {
  name: string
  code: number
}

interface District {
  name: string
  code: number
  wards: Ward[]
}

interface Province {
  name: string
  code: number
  districts: District[]
}

export default function HomePage() {
  const [location, setLocation] = useState<{
    province: Province | null
    district: District | null
    ward: Ward | null
  }>({
    province: null,
    district: null,
    ward: null,
  })

  if (location.province && location.district && location.ward) {
    console.log(location.province.name, location.district.name, location.ward.name)
  }
  return (
    <main className="p-8 space-y-4">
      <LocationSelector onChange={setLocation} />
      {/* <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(location, null, 2)}</pre> */}
    </main>
  )
}
