"use client"

import { motion } from "framer-motion"

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center space-x-2 pt-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex items-center">
          <div className="relative">
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                index + 1 === currentStep ? "bg-primary" : index + 1 < currentStep ? "bg-primary/80" : "bg-muted"
              }`}
            >
              {index + 1 === currentStep && (
                <motion.div
                  className="absolute -inset-1 rounded-full border-2 border-primary"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />
              )}
            </div>
          </div>
          {index < totalSteps - 1 && (
            <div className={`h-0.5 w-6 ${index + 1 < currentStep ? "bg-primary/80" : "bg-muted"}`} />
          )}
        </div>
      ))}
    </div>
  )
}
