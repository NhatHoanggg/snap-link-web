"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { LinkIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { registerCustomer, registerPhotographer } from "@/services/auth.service"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import StepIndicator from "./step/step-indicator"
import BasicInfoStep from "./step/basic-info-step"
import PasswordStep from "./step/password-step"
import PhotographerDetailsStep from "./step/photographer-details-step"
import LocationStep from "./step/location-step"
import FinalStep from "./step/final-step"

interface FormData {
  name: string
  email: string
  phoneNumber: string
  password: string
  confirmPassword: string
  role: "CUSTOMER" | "PHOTOGRAPHER"
  tags: string[]
  province: string
  district: string
  ward: string
  address_detail: string
  pricePerHour?: number
  experienceYears: number
  agreeToTerms: boolean
}

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "CUSTOMER",
    tags: [],
    province: "",
    district: "",
    ward: "",
    address_detail: "",
    pricePerHour: 0,
    experienceYears: 0,
    agreeToTerms: false,
  })

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setError(null)
  }

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const getTotalSteps = () => {
    return formData.role === "PHOTOGRAPHER" ? 5 : 3
  }

  const handleSubmit = async () => {
    if (!formData.agreeToTerms) {
      toast({
        title: "Terms and Conditions",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      if (formData.role === "CUSTOMER") {
        await registerCustomer({
          email: formData.email,
          full_name: formData.name,
          password: formData.password,
          confirm_password: formData.confirmPassword,
          phone_number: formData.phoneNumber,
          province: formData.province,
          district: formData.district,
          ward: formData.ward,
          address_detail: formData.address_detail,
        })
        toast({
          title: "Registration Successful",
          description: "Your account has been created successfully",
        })
      } else {
        const photographerData = {
          email: formData.email,
          full_name: formData.name,
          phone_number: formData.phoneNumber,
          password: formData.password,
          confirm_password: formData.confirmPassword,
          province: formData.province,
          district: formData.district,
          ward: formData.ward,
          address_detail: formData.address_detail,
          tags: formData.tags,
          price_per_hour: formData.pricePerHour || 0,
          experience_years: formData.experienceYears,
        }
        
        console.log('Sending photographer data:', photographerData)
        
        await registerPhotographer(photographerData)
        toast({
          title: "Registration Successful",
          description: "Your photographer account has been created successfully",
        })
      }
      router.push("/login")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed"
      setError(errorMessage)
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep formData={formData} updateFormData={updateFormData} onNext={nextStep} />
      case 2:
        return <PasswordStep formData={formData} updateFormData={updateFormData} onNext={nextStep} onPrev={prevStep} />
      case 3:
        return formData.role === "PHOTOGRAPHER" ? (
          <PhotographerDetailsStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        ) : (
          <FinalStep
            formData={formData}
            updateFormData={updateFormData}
            onSubmit={handleSubmit}
            onPrev={prevStep}
            isLoading={isLoading}
          />
        )
      case 4:
        return formData.role === "PHOTOGRAPHER" ? (
          <LocationStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        ) : null
      case 5:
        return (
          <FinalStep
            formData={formData}
            updateFormData={updateFormData}
            onSubmit={handleSubmit}
            onPrev={prevStep}
            isLoading={isLoading}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-muted/30 shadow-lg">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <LinkIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
              <CardDescription className="pt-1 text-muted-foreground">Join SnapLink to start</CardDescription>
            </div>
            <StepIndicator currentStep={currentStep} totalSteps={getTotalSteps()} />
          </CardHeader>

          <CardContent>
            {error && <div className="text-sm text-destructive text-center mb-4">{error}</div>}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
