"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Loader2 } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Vui lòng nhập email");
      return;
    }

    try {
      setIsSending(true);
      // Giả lập gọi API
      await new Promise((res) => setTimeout(res, 1500));

      toast.success("Email đặt lại mật khẩu đã được gửi!");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Quên mật khẩu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center mb-6 text-sm">
            Nhập địa chỉ email của bạn để nhận liên kết đặt lại mật khẩu.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  disabled={isSending}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSending}>
              {isSending ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  Đang gửi...
                </>
              ) : (
                "Gửi liên kết đặt lại"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#fff",
            color: "#374151",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "12px 16px",
          },
        }}
      />
    </div>
  );
}
