import type React from "react"
import Image from "next/image"

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen">
      <div className="hidden md:block w-full md:w-2/5 h-screen bg-muted/10">
        <div className="h-full flex items-center justify-center p-6">
          <div className="w-full max-w-md rounded-lg overflow-hidden border border-muted/30 shadow-lg">
            <Image
              src="/images/bg-1.svg"
              alt="Background"
              width={500}
              height={600}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
      <div className="w-full md:w-3/5">{children}</div>
    </div>
  )
}
