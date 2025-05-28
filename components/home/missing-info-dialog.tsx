"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { userService, MissingInfoResponse } from "@/services/user.service"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

export function MissingInfoDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [missingInfo, setMissingInfo] = useState<MissingInfoResponse | null>(null)

  useEffect(() => {
    checkMissingInfo()
  }, [])

  const checkMissingInfo = async () => {
    try {
      const response = await userService.checkMissingInfo()
      setMissingInfo(response)
      if (response.has_missing_info) {
        setIsOpen(true)
      }
    } catch (error) {
      console.error("Error checking missing info:", error)
      toast.error("Không thể kiểm tra thông tin thiếu")
    }
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  if (!missingInfo?.has_missing_info) return null

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            <DialogHeader>
              <DialogTitle>Thông tin cần bổ sung</DialogTitle>
              <DialogDescription>
                Vui lòng cập nhật các thông tin sau để có thể sử dụng đầy đủ tính năng của SnapLink
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Button 
              variant="outline"
              className="bg-primary text-white hover:bg-primary/90 mt-4"
              onClick={() => {
                window.location.href = "/profile/edit"
              }}>Bổ sung thông tin</Button>
              {/* <ul className="list-disc pl-4 space-y-2">
                {missingInfo.missing_fields.map((field, index) => (
                  <li key={index} className="text-sm">
                    {field}
                  </li>
                ))}
              </ul> */}
              <div className="flex justify-end">
                <Button onClick={handleClose}>Đóng</Button>
              </div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.2 }}
            className="fixed top-4 right-4 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white shadow-lg"
            >
              Bổ sung thông tin
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
