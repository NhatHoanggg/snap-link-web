"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ServiceCard } from "./service-card"
import { getServices, deleteService, type Service } from "@/services/services.service"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ServicesList() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null)
  const router = useRouter()

  const fetchServices = async () => {
    try {
      const data = await getServices()
      setServices(data)
    } catch (error) {
      console.error("Error fetching services:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleEdit = (service: Service) => {
    router.push(`/services/edit/${service.service_id}`)
  }

  const handleDelete = async (serviceId: number) => {
    try {
      await deleteService(serviceId)
      setServices(services.filter(service => service.service_id !== serviceId))
    } catch (error) {
      console.error("Error deleting service:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Danh sách dịch vụ</h2>
        <Button onClick={() => router.push('/services/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm dịch vụ
        </Button>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Chưa có dịch vụ nào. Hãy tạo dịch vụ mới!</p>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6"
        >
          {services.map((service) => (
            <ServiceCard
              key={service.service_id}
              service={service}
              onEdit={handleEdit}
              onDelete={(id) => setServiceToDelete(id)}
              onUpdate={fetchServices}
            />
          ))}
        </motion.div>
      )}

      <AlertDialog open={!!serviceToDelete} onOpenChange={() => setServiceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa dịch vụ</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa dịch vụ này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (serviceToDelete) {
                handleDelete(serviceToDelete)
                setServiceToDelete(null)
              }
            }}>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
