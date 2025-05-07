import { Badge } from "@/components/ui/badge"
import { Photographer } from "@/services/photographer.service"
import Image from "next/image"

export default function BookingHeader({ photographer }: { photographer: Photographer | null }) {
  if (!photographer) return null

  return (
    <div className="relative w-full h-52 md:h-64 rounded-xl overflow-hidden shadow mb-6">
      <Image
        src={photographer.background_image || "/placeholder.jpg"}
        alt="Background"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex items-end p-4 md:p-6">
        <div className="flex items-center space-x-4">
          <div className="relative w-32 h-32 rounded-full border-2 border-white overflow-hidden">
            <Image
              src={photographer.avatar_url || "/avatar-placeholder.jpg"}
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-white text-xl font-semibold">{photographer.full_name}</h2>
            <p className="text-sm text-white/80">{photographer.province}, {photographer.district}, {photographer.ward}</p>
            <p className="text-sm text-white/80">{photographer.address_detail}</p>
            <Badge className="mt-1">{photographer.total_bookings} lượt đặt lịch</Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
