"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ChevronLeft, Sun, Moon, Laptop, Settings } from "lucide-react"

export default function ThemeSettings() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Theme preview component
  const ThemePreview = ({ themeName }: { themeName: string }) => {
    const isActive = mounted && theme === themeName
    const previewTheme = themeName === "system" ? resolvedTheme : themeName

    return (
      <div
        className={`relative rounded-lg overflow-hidden border-2 transition-all ${
          isActive ? "border-primary ring-2 ring-primary/20" : "border-border"
        }`}
      >
        <div className={`p-4 ${previewTheme === "dark" ? "bg-zinc-900 text-zinc-50" : "bg-white text-zinc-950"}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${previewTheme === "dark" ? "bg-zinc-700" : "bg-zinc-200"}`}></div>
              <div className={`w-3 h-3 rounded-full ${previewTheme === "dark" ? "bg-zinc-700" : "bg-zinc-200"}`}></div>
              <div className={`w-3 h-3 rounded-full ${previewTheme === "dark" ? "bg-zinc-700" : "bg-zinc-200"}`}></div>
            </div>
            <div className={`w-6 h-2 rounded-full ${previewTheme === "dark" ? "bg-zinc-700" : "bg-zinc-200"}`}></div>
          </div>

          <div className="space-y-2">
            <div className={`h-2 w-2/3 rounded-full ${previewTheme === "dark" ? "bg-zinc-700" : "bg-zinc-200"}`}></div>
            <div className={`h-2 w-full rounded-full ${previewTheme === "dark" ? "bg-zinc-700" : "bg-zinc-200"}`}></div>
            <div className={`h-2 w-4/5 rounded-full ${previewTheme === "dark" ? "bg-zinc-700" : "bg-zinc-200"}`}></div>
          </div>

          <div className="mt-4 flex gap-2">
            <div className={`h-6 w-6 rounded-md ${previewTheme === "dark" ? "bg-primary/80" : "bg-primary"}`}></div>
            <div className={`h-6 w-10 rounded-md ${previewTheme === "dark" ? "bg-zinc-700" : "bg-zinc-200"}`}></div>
          </div>
        </div>

        <div
          className={`p-2 text-center text-xs font-medium ${
            previewTheme === "dark" ? "bg-zinc-800 text-zinc-400" : "bg-zinc-50 text-zinc-500"
          }`}
        >
          {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
        </div>
      </div>
    )
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button variant="ghost" size="sm" asChild className="gap-1 pl-0 hover:pl-2 transition-all mb-2">
            <Link href="/settings">
              <ChevronLeft className="h-4 w-4" />
              Trở lại cài đặt
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Tùy chọn giao diện</h1>
          <p className="text-muted-foreground mt-1">Tùy chọn giao diện của ứng dụng</p>
        </div>
        <Settings className="h-8 w-8 text-muted-foreground" />
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Sun className="h-5 w-5" />
            <Moon className="h-5 w-5" />
            <span>Theme Mode</span>
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <div className="cursor-pointer" onClick={() => setTheme("light")}>
              <ThemePreview themeName="light" />
            </div>
            <div className="cursor-pointer" onClick={() => setTheme("dark")}>
              <ThemePreview themeName="dark" />
            </div>
            <div className="cursor-pointer" onClick={() => setTheme("system")}>
              <ThemePreview themeName="system" />
            </div>
          </div>

          <div className="mt-4">
            <RadioGroup
              defaultValue={theme}
              value={theme}
              onValueChange={(value) => setTheme(value)}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="flex items-center gap-1.5">
                  <Sun className="h-4 w-4" />
                  Sáng
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="flex items-center gap-1.5">
                  <Moon className="h-4 w-4" />
                  Tối
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system" className="flex items-center gap-1.5">
                  <Laptop className="h-4 w-4" />
                  Hệ thống
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
