"use client"

import { useAuth } from "@/services/auth"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { LoginForm } from "@/components/auth/login-form"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface AuthCheckProps {
  children: React.ReactNode
  onAuthSuccess?: () => void
  href?: string
}

export function AuthCheck({ children, onAuthSuccess, href }: AuthCheckProps) {
  const { isAuthenticated } = useAuth()
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const router = useRouter()

  const handleAuthSuccess = () => {
    setShowLoginDialog(false)
    if (onAuthSuccess) {
      onAuthSuccess()
    }
    if (href) {
      router.push(href)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault()
      e.stopPropagation()
      setShowLoginDialog(true)
    }
    else {
      return;
    }
  }

  return (
    <>
      <div onClick={handleClick} className="contents">
        {children}
      </div>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Đăng nhập</DialogTitle>
            <DialogDescription>
              Vui lòng đăng nhập để tiếp tục
            </DialogDescription>
          </DialogHeader>
          <LoginForm onSuccess={handleAuthSuccess} />
        </DialogContent>
      </Dialog>
    </>
  )
} 