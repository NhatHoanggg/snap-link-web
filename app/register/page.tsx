"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, Mail, User, LinkIcon, Github, Twitter, MapPin, Phone } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: "CUSTOMER" | "PHOTOGRAPHER"
  bio: string[]
  location: string
  phoneNumber: string
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CUSTOMER",
    bio: [],
    location: "",
    phoneNumber: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreeToTerms) {
      alert("Please agree to the terms and conditions")
      return
    }

    setIsLoading(true)

    // Simulate API call
    try {
      // Add your registration logic here
      console.log("Registration attempt with:", formData)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
      // After successful registration:
      // router.push("/login")
    } catch (error) {
      console.error("Registration failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Password strength calculation
  const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0

    let strength = 0

    // Length check
    if (password.length >= 8) strength += 25

    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    if (/[^A-Za-z0-9]/.test(password)) strength += 25

    return strength
  }

  const passwordStrength = calculatePasswordStrength(formData.password)

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return ""
    if (passwordStrength <= 25) return "Weak"
    if (passwordStrength <= 50) return "Fair"
    if (passwordStrength <= 75) return "Good"
    return "Strong"
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-destructive"
    if (passwordStrength <= 50) return "bg-amber-500"
    if (passwordStrength <= 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword

  const bioOptions = [
    "Portrait Photography",
    "Wedding Photography",
    "Landscape Photography",
    "Event Photography",
    "Fashion Photography",
    "Product Photography",
    "Street Photography",
    "Wildlife Photography",
  ]

  const handleBioChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      bio: prev.bio.includes(value)
        ? prev.bio.filter((item) => item !== value)
        : [...prev.bio, value],
    }))
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="w-full max-w-md border-muted/30 shadow-lg">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <LinkIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
              <CardDescription className="pt-1 text-muted-foreground">
                Join SnapLink to start
              </CardDescription>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="role" className="text-sm font-medium">
                  {/* {formData.role === "CUSTOMER" ? "Customer" : "Photographer"} */}
                  {formData.role === "CUSTOMER" 
                      ? <p className="text-sm font-medium">Customer</p>
                      : <p className="text-sm font-medium line-through italic">Customer</p>
                  }
                </Label>
                <Switch
                  id="role"
                  checked={formData.role === "PHOTOGRAPHER"}
                  onCheckedChange={(checked: boolean) =>
                    setFormData((prev) => ({
                      ...prev,
                      role: checked ? "PHOTOGRAPHER" : "CUSTOMER",
                    }))
                  }
                />
                <Label htmlFor="role" className="text-sm font-medium">
                  {formData.role === "PHOTOGRAPHER" 
                      ? <p className="text-sm font-medium">Photographer</p>
                      : <p className="text-sm font-medium line-through italic">Photographer</p>
                  }
                </Label>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  {formData.password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Password strength:</span>
                        <span
                          className={
                            passwordStrength > 75
                              ? "text-green-500"
                              : passwordStrength > 50
                                ? "text-yellow-500"
                                : passwordStrength > 25
                                  ? "text-amber-500"
                                  : "text-destructive"
                          }
                        >
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <Progress
                        value={passwordStrength}
                        className={cn(
                          "h-1.5",
                          getPasswordStrengthColor()
                        )}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`pl-10 ${formData.confirmPassword && !passwordsMatch ? "border-destructive" : ""}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {formData.confirmPassword && !passwordsMatch && (
                    <p className="text-xs text-destructive mt-1">Passwords do not match</p>
                  )}
                </div>

                {formData.role === "PHOTOGRAPHER" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-medium">
                        Photography Specialties
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {bioOptions.map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={option}
                              checked={formData.bio.includes(option)}
                              onCheckedChange={() => handleBioChange(option)}
                            />
                            <Label htmlFor={option} className="text-sm">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-sm font-medium">
                        Location
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="location"
                          name="location"
                          type="text"
                          placeholder="City, Country"
                          value={formData.location}
                          onChange={handleChange}
                          className="pl-10"
                          required={formData.role === "PHOTOGRAPHER"}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber" className="text-sm font-medium">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          placeholder="+1 (234) 567-8900"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className="pl-10"
                          required={formData.role === "PHOTOGRAPHER"}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || !passwordsMatch || !agreeToTerms}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>

              <div className="relative flex items-center justify-center">
                <Separator className="w-full" />
                <span className="absolute bg-card px-2 text-xs text-muted-foreground">OR CONTINUE WITH</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button" className="w-full">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
                <Button variant="outline" type="button" className="w-full">
                  <Twitter className="mr-2 h-4 w-4" />
                  Twitter
                </Button>
              </div>
            </CardContent>
          </form>
          <CardFooter className="flex justify-center border-t p-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

