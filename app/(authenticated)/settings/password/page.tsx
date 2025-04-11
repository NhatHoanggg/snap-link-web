"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, AlertCircle, Eye, EyeOff, Lock, ShieldCheck, KeyRound, Sparkles } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { userService } from "@/lib/services/user.service"

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type FormData = z.infer<typeof passwordSchema>

export default function ChangePasswordPage() {
  const { token } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(passwordSchema),
  })

  const newPassword = watch("newPassword", "")

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0

    let strength = 0
    // Length
    if (password.length >= 8) strength += 20
    if (password.length >= 12) strength += 10

    // Complexity
    if (/[A-Z]/.test(password)) strength += 15
    if (/[a-z]/.test(password)) strength += 15
    if (/[0-9]/.test(password)) strength += 15
    if (/[^A-Za-z0-9]/.test(password)) strength += 15

    // Variety
    const uniqueChars = new Set(password).size
    strength += Math.min(10, uniqueChars * 2)

    return Math.min(100, strength)
  }

  // Update password strength when password changes
  useEffect(() => {
    if (newPassword) {
      setPasswordStrength(calculatePasswordStrength(newPassword))
    } else {
      setPasswordStrength(0)
    }
  }, [newPassword])

  const onSubmit = async (data: FormData) => {
    if (!token) {
      setError("You must be logged in to change your password")
      return
    }

    setIsSubmitting(true)
    setError("")
    setSuccess(false)

    try {
      await userService.changePassword(
        {
          current_password: data.currentPassword,
          new_password: data.newPassword,
          confirm_password: data.confirmPassword,
        },
        token
      )

      setSuccess(true)
      reset()
      setPasswordStrength(0)
    } catch (error) {
      console.error('Password change error:', error)
      setError(error instanceof Error ? error.message : "An error occurred while changing your password. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStrengthText = () => {
    if (passwordStrength < 30) return "Weak"
    if (passwordStrength < 60) return "Moderate"
    if (passwordStrength < 80) return "Strong"
    return "Very Strong"
  }

  const getStrengthColor = () => {
    if (passwordStrength < 30) return "bg-red-500"
    if (passwordStrength < 60) return "bg-yellow-500"
    if (passwordStrength < 80) return "bg-green-500"
    return "bg-emerald-500"
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-background/80">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
          animate={{
            x: [0, 10, -10, 0],
            y: [0, -10, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-secondary/5 blur-3xl"
          animate={{
            x: [0, -15, 15, 0],
            y: [0, 15, -15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border border-border/40 shadow-lg backdrop-blur-sm bg-card/80">
          <CardHeader className="space-y-1 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto bg-primary/10 p-2 rounded-full w-12 h-12 flex items-center justify-center mb-2"
            >
              <Lock className="h-6 w-6 text-primary" />
            </motion.div>
            <CardTitle className="text-2xl font-bold">Change Password</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert className="bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      Your password has been changed successfully! Your account is now secure.
                    </AlertDescription>
                  </Alert>
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-sm font-medium">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`pr-10 ${errors.currentPassword ? "border-destructive" : ""}`}
                    {...register("currentPassword")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">{showCurrentPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
                {errors.currentPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive"
                  >
                    {errors.currentPassword.message}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`pr-10 ${errors.newPassword ? "border-destructive" : ""}`}
                    {...register("newPassword")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">{showNewPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
                {errors.newPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive"
                  >
                    {errors.newPassword.message}
                  </motion.p>
                )}

                {/* Password strength indicator */}
                {newPassword && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Password Strength</span>
                      <span className="text-xs font-medium">{getStrengthText()}</span>
                    </div>
                    <Progress
                      value={passwordStrength}
                      className={`h-1.5 ${getStrengthColor()} transition-all duration-500`}
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="grid grid-cols-2 gap-2 mt-3"
                    >
                      <div className="flex items-center text-xs space-x-1">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            /[A-Z]/.test(newPassword) ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        />
                        <span className="text-muted-foreground">Uppercase</span>
                      </div>
                      <div className="flex items-center text-xs space-x-1">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            /[a-z]/.test(newPassword) ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        />
                        <span className="text-muted-foreground">Lowercase</span>
                      </div>
                      <div className="flex items-center text-xs space-x-1">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            /[0-9]/.test(newPassword) ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        />
                        <span className="text-muted-foreground">Number</span>
                      </div>
                      <div className="flex items-center text-xs space-x-1">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            /[^A-Za-z0-9]/.test(newPassword) ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        />
                        <span className="text-muted-foreground">Special</span>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                    {...register("confirmPassword")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive"
                  >
                    {errors.confirmPassword.message}
                  </motion.p>
                )}
              </div>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="pt-2">
                <Button type="submit" className="w-full font-medium" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                    />
                  ) : (
                    <ShieldCheck className="mr-2 h-4 w-4" />
                  )}
                  {isSubmitting ? "Updating Password..." : "Update Password"}
                </Button>
              </motion.div>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-0">
            <div className="text-xs text-center text-muted-foreground">
              <div className="flex items-center justify-center mb-2">
                <KeyRound className="h-3 w-3 mr-1" />
                <span>Password Security Tips</span>
              </div>
              <p>
                Use a unique password that you don&apos;t use for other websites. Consider using a password manager to
                generate and store strong passwords.
              </p>
            </div>
          </CardFooter>
        </Card>

        {/* Decorative elements */}
        <motion.div
          className="absolute -z-10 bottom-10 right-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <Sparkles className="h-6 w-6 text-primary/30" />
        </motion.div>
        <motion.div
          className="absolute -z-10 top-10 left-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
        >
          <Sparkles className="h-6 w-6 text-secondary/30" />
        </motion.div>
      </motion.div>
    </div>
  )
}
