"use client"

import { useAuth } from "@/services/auth"
import { Navbar } from "@/components/navbar"
import { usePathname } from "next/navigation"

export function NavbarWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const pathname = usePathname()

  // Don't show navbar on home page when authenticated
  const shouldShowNavbar = !isAuthenticated || pathname !== "/home"

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      {children}
    </>
  )
} 