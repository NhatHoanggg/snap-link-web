"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BookingStep1 } from "./booking-step-1"
import { BookingStep2 } from "./booking-step-2"
import { BookingStep3 } from "./booking-step-3"
import { BookingStep4 } from "./booking-step-4"
import { BookingStep5 } from "./booking-step-5"
import { BookingReview } from "./booking-review"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { BookingStepIndicator } from "./booking-step-indicator"
import type { BookingFormData } from "@/services/booking.service"

export function BookingForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<BookingFormData>({
    date: undefined,
    service: "",
    shootingType: "studio",
    location: "19 Đặng Huy Trứ",
    package: "",
    concept: "",
    illustrations: [],
  })
  const { toast } = useToast()

  const nextStep = () => {
    if (step < 6) {
      setStep(step + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const updateFormData = (data: Partial<BookingFormData>) => {
    setFormData((prev: BookingFormData) => ({ ...prev, ...data }))
  }

  const handleSubmit = async () => {
    try {
      // Ở đây bạn sẽ gửi dữ liệu đến API
      // await fetch('/api/bookings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })

      toast({
        title: "Đặt lịch thành công",
        description: "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
      })

      // Reset form sau khi đặt lịch thành công
      setFormData({
        date: undefined,
        service: "",
        shootingType: "studio",
        location: "19 Đặng Huy Trứ",
        package: "",
        concept: "",
        illustrations: [],
      })
      setStep(1)
    } catch (error) {
      console.error("Error submitting booking form:", error)
      toast({
        title: "Đặt lịch thất bại",
        description: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  const variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  }

  return (
    <div className="max-w-3xl mx-auto">
      <BookingStepIndicator currentStep={step} />

      <Card className="mt-8 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && <BookingStep1 formData={formData} updateFormData={updateFormData} nextStep={nextStep} />}
            {step === 2 && (
              <BookingStep2
                formData={formData}
                updateFormData={updateFormData}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}
            {step === 3 && (
              <BookingStep3
                formData={formData}
                updateFormData={updateFormData}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}
            {step === 4 && (
              <BookingStep4
                formData={formData}
                updateFormData={updateFormData}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}
            {step === 5 && (
              <BookingStep5
                formData={formData}
                updateFormData={updateFormData}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}
            {step === 6 && <BookingReview formData={formData} prevStep={prevStep} handleSubmit={handleSubmit} />}
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  )
}
