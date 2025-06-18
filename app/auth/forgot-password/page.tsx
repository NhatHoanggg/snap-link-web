"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, ArrowLeft } from "lucide-react";
import { forgotPassword } from "@/services/auth.service";
import toast, {Toaster} from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Vui lòng nhập địa chỉ email");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Email không hợp lệ");

      return;
    }

    setIsLoading(true);

    try {
      await forgotPassword(email);
      toast.success("Mã OTP đã được gửi đến email của bạn");

      router.push(
        `/auth/forgot-password/reset-password?email=${encodeURIComponent(
          email
        )}`
      );
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra. Hãy thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/auth/login")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>

        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-card-foreground">
              Quên mật khẩu?
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Nhập địa chỉ email của bạn để nhận mã xác thực
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-card-foreground"
                >
                  Địa chỉ email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-input focus:border-primary focus:ring-primary"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Đang gửi...
                  </div>
                ) : (
                  "Gửi mã xác thực"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Bạn đã nhớ mật khẩu?{" "}
                <button
                  onClick={() => router.push("/auth/login")}
                  className="text-primary hover:text-primary/90 font-medium hover:underline"
                >
                  Đăng nhập
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster position="bottom-right"/>
    </div>
  );
};

export default ForgotPassword;
