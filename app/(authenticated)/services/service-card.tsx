"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Info, Edit2, Trash2, Clock, Archive  } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Service } from "@/services/services.service"
import { Switch } from "@/components/ui/switch"
import { updateService } from "@/services/services.service"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ServiceCardProps {
  service: Service
  onEdit?: (service: Service) => void
  onDelete?: (serviceId: number) => void
  onUpdate?: () => void
}

export function ServiceCard({ service, onEdit, onDelete, onUpdate }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(service.is_active)

  const handleToggleActive = async () => {
    try {
      await updateService(service.service_id, {
        ...service,
        is_active: !isActive,
      })
      setIsActive(!isActive)
      toast.success("Cập nhật trạng thái thành công")
      onUpdate?.()
    } catch (error) {
      console.error("Error updating service status:", error)
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái")
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={item}
      whileHover={{
        scale: 1.01,
        transition: { duration: 0.2 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="relative w-full h-48 md:w-64 md:h-64 overflow-hidden">
            <Image
              src={service.thumbnail_url || "/placeholder.svg"}
              alt={service.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover transition-all duration-700 ${isHovered ? "scale-110" : "scale-100"}`}
            />
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="font-medium bg-white/90 text-black">
                {formatCurrency(service.price)}
              </Badge>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 flex flex-col">
            <CardContent className="flex-1 p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-4">
                <h3 className="text-xl font-semibold line-clamp-1">{service.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Hoạt động</span>
                  <Switch checked={isActive} onCheckedChange={handleToggleActive} />
                </div>
              </div>
              <p className="text-muted-foreground line-clamp-2 mb-4">{service.description}</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Tạo: {formatDate(service.created_at)}</span>
                </div>
                {service.updated_at && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Cập nhật: {formatDate(service.updated_at)}</span>
                  </div>
                )}
              </div>
              <p className="text-muted-foreground text-sm mt-2 flex items-center">
                <Archive className="w-4 h-4 mr-2" />
                <span>Đơn vị: </span>
                <span className="font-bold text-primary indent-2"> {service.unit_type === "package" ? " Gói" : " Người"}</span>
              </p>
            </CardContent>

            <CardFooter className="px-4 md:px-6 pb-4 md:pb-6 pt-0 flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Info className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{service.title}</DialogTitle>
                    <DialogDescription>Chi tiết gói dịch vụ chụp ảnh</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <Image
                        src={service.thumbnail_url || "/placeholder.svg"}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="font-medium">Mô tả:</div>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                    <div className="grid gap-2">
                      <div className="font-medium">Giá:</div>
                      <p className="text-sm text-muted-foreground">{formatCurrency(service.price)}</p>
                    </div>
                    <div className="grid gap-2">
                      <div className="font-medium">Trạng thái:</div>
                      <p className="text-sm text-muted-foreground">
                        {isActive ? "Đang hoạt động" : "Không hoạt động"}
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <div className="font-medium">Ngày tạo:</div>
                      <p className="text-sm text-muted-foreground">{formatDate(service.created_at)}</p>
                    </div>
                    {service.updated_at && (
                      <div className="grid gap-2">
                        <div className="font-medium">Ngày cập nhật:</div>
                        <p className="text-sm text-muted-foreground">{formatDate(service.updated_at)}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    {onEdit && (
                      <Button variant="outline" onClick={() => onEdit(service)}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Chỉnh sửa
                      </Button>
                    )}
                    <Button>Đặt lịch ngay</Button>
                  </div>
                </DialogContent>
              </Dialog>

              {onEdit && (
                <Button variant="outline" size="icon" onClick={() => onEdit(service)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
              )}
              {onDelete && (
                <Button variant="outline" size="icon" onClick={() => onDelete(service.service_id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </CardFooter>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}