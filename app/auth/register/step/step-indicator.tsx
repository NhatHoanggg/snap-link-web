"use client"

import { motion } from "framer-motion"

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center space-x-2 pt-2">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index + 1 === currentStep
        const isCompleted = index + 1 < currentStep

        return (
          <div key={index} className="flex items-center">
            <div className="relative">
              <div
                className={`h-3 w-3 rounded-full border ${
                  isActive
                    ? "bg-primary border-primary"
                    : isCompleted
                    ? "bg-primary/70 border-primary/70"
                    : "bg-muted border-border"
                }`}
              >
                {isActive && (
                  <motion.div
                    className="absolute -inset-1 rounded-full border-2 border-primary shadow-md"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.7,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                )}
              </div>
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`h-0.5 w-6 ${
                  isCompleted ? "bg-primary/70" : "bg-muted"
                } rounded-full transition-colors duration-300`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
