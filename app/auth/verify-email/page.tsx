"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { ArrowRight, Loader2 } from "lucide-react"
import { verifyEmail } from "@/services/auth.service"
import { useRouter } from "next/navigation"

export default function OtpVerificationPage() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState<string | null>(null)
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  
  useEffect(() => {
    if (searchParams) {
      setEmail(searchParams.get("email"))
    }
  }, [searchParams])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1)
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Focus previous input on backspace if current input is empty
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp]
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i]
      }
      setOtp(newOtp)
      // Focus the next empty input or the last input
      const nextEmptyIndex = newOtp.findIndex((value) => !value)
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus()
      } else {
        inputRefs.current[5]?.focus()
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const otpString = otp.join("")
    if (otpString.length !== 6) {
      toast({
        variant: "destructive",
        title: "Mã OTP không hợp lệ",
        description: "Vui lòng nhập đầy đủ 6 chữ số của mã OTP",
      })
      return
    }

    setIsLoading(true)

    try {
      if (!email) {
        throw new Error("Email không hợp lệ")
      }
      await verifyEmail(email, otpString)
      toast({
        title: "Xác thực thành công",
        description: "Email của bạn đã được xác thực thành công",
      })
      // Redirect to login or dashboard
      router.push("/auth/login")
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Xác thực thất bại",
        description: "Mã OTP không hợp lệ hoặc đã hết hạn",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsResending(true)
    try {
      // TODO: Implement actual API call to resend OTP
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Đã gửi lại mã OTP",
        description: `Mã OTP mới đã được gửi đến ${email}`,
      })
      // Clear OTP inputs after resending
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Gửi lại mã thất bại",
        description: "Đã xảy ra lỗi khi gửi lại mã OTP",
      })
    } finally {
      setIsResending(false)
    }
  }

  if (!email) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-8 rounded-xl bg-card p-8 shadow-md text-center">
          <h1 className="text-2xl font-bold tracking-tight text-card-foreground">Đang tải...</h1>
          <p className="mt-2 text-sm text-muted-foreground">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-card p-8 shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-card-foreground">Xác thực Email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Vui lòng nhập mã 6 chữ số đã được gửi đến
          </p>
          <p className="mt-1 text-sm font-medium text-primary">{email}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="h-12 w-12 rounded-lg border border-input text-center text-lg font-semibold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background text-foreground"
                />
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">Mã OTP sẽ hết hạn sau 5 phút</p>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={otp.some(digit => !digit) || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xác thực...
              </>
            ) : (
              <>
                Xác thực
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-sm font-medium text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleResendOtp}
            disabled={isResending}
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                Đang gửi lại...
              </>
            ) : (
              "Gửi lại mã OTP"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
