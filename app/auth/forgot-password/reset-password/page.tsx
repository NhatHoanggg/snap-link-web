'use client'
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { verifyResetOTP, resetPassword, forgotPassword } from "@/services/auth.service";
import toast, {Toaster} from "react-hot-toast";

const ResetPassword = () => {
  const [step, setStep] = useState<"otp" | "password">("otp");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error("Vui lòng nhập đầy đủ 6 chữ số OTP")
      return;
    }

    setIsLoading(true);
    
    try {
      await verifyResetOTP(email, otp);
      toast.success("OTP hợp lệ. Vui lòng đặt mật khẩu mới")
      
      setStep("password");
    } catch (error) {
        console.log(error)
      toast.error("OTP không hợp lệ. Vui lòng thử lại")
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || password.length < 8) {
      toast.error("Mật khẩu phải ít nhất 8 chữ số")
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp")
      return;
    }

    setIsLoading(true);
    
    try {
      await resetPassword({
        email,
        otp,
        new_password: password,
        confirm_password: confirmPassword
      });
      
      toast.success("Mật khẩu đã được đặt lại thành công")
      
      router.push("/auth/login");
    } catch (error) {
        console.log(error)
        toast.error("Có lỗi xảy ra. Vui lòng thử lại")

    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/auth/forgot-password")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>

        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-card-foreground">
              {step === "otp" ? "Xác thực OTP" : "Đặt mật khẩu mới"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {step === "otp" 
                ? `Mã OTP đã được gửi đến ${email}`
                : "Vui lòng nhập mật khẩu mới của bạn"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {step === "otp" ? (
              <form onSubmit={handleOTPSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium text-card-foreground">
                    Mã OTP (6 chữ số)
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={handleOTPChange}
                    className="h-12 text-center text-2xl font-mono tracking-widest border-input focus:border-primary focus:ring-primary"
                    disabled={isLoading}
                    maxLength={6}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Đang xác thực...
                    </div>
                  ) : (
                    "Xác thực OTP"
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Chưa nhận được mã?{" "}
                    <button
                      type="button"
                      className="text-primary hover:text-primary/90 font-medium hover:underline"
                      onClick={async () => {
                        try {
                          await forgotPassword(email);
                          toast.success("OTP đã được gửi lại thành công")
                        } catch (error) {
                          console.log(error)
                          toast.error("Không thể gửi lại mã OTP")
                        }
                      }}
                    >
                      Gửi lại
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-card-foreground">
                    Mật khẩu mới
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu mới"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pr-12 border-input focus:border-primary focus:ring-primary"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-card-foreground">
                    Xác nhận mật khẩu
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12 pr-12 border-input focus:border-primary focus:ring-primary"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Đang cập nhật...
                    </div>
                  ) : (
                    "Đặt lại mật khẩu"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
      <Toaster position="bottom-right"/>
    </div>
  );
};

export default ResetPassword;