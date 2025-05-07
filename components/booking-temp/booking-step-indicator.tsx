"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookingStepIndicatorProps {
  currentStep: number
}

export function BookingStepIndicator({ currentStep }: BookingStepIndicatorProps) {
  const steps = [
    { id: 1, name: "Ngày" },
    { id: 2, name: "Dịch vụ" },
    { id: 3, name: "Địa điểm" },
    { id: 4, name: "Gói" },
    { id: 5, name: "Concept" },
    { id: 6, name: "Xác nhận" },
  ]

  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center justify-center">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={cn(stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : "", "relative")}>
            {step.id < currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-primary" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <Check className="h-5 w-5 text-white" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            ) : step.id === currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700" />
                </div>
                <div
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-white dark:bg-gray-900 text-primary font-medium"
                  aria-current="step"
                >
                  {step.id}
                </div>
                <div className="hidden sm:block absolute top-10 -translate-x-1/2 left-4 text-xs font-medium text-primary">
                  {step.name}
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  {step.id}
                </div>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
