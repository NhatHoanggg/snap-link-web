"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle, Mail, MapPin, Phone, Send } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Footer } from "@/components/footer";
import Image from "next/image";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      toast({
        title: "Thông báo",
        description: "Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ liên lạc lại với bạn sớm nhất có thể!",
      });

      reset();
    } catch (error) {
      console.error("Lỗi:", error);
      setSubmitError(
        "Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="container mx-auto py-12 px-4 md:px-6 mt-16">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-3">Liên hệ với chúng tôi</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Có câu hỏi về dịch vụ của chúng tôi? Cần đặt lịch hẹn? Chúng tôi sẵn sàng giúp đỡ bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Left side - Image */}
          <div className="flex items-center justify-center">
            <div className="relative w-96 h-96 rounded-lg overflow-hidden">
              <Image
                src="/images/contact.png"
                alt="Contact Us"
                width={384}
                height={384}
                className="object-cover"
              />
            </div>
          </div>

          {/* Right side - Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Liên hệ với chúng tôi</CardTitle>
              <CardDescription>
                Đội ngũ của chúng tôi sẵn sàng giúp đỡ bạn với bất kỳ câu hỏi nào về dịch vụ của chúng tôi.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground">
                    info@snaplink.vn
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h3 className="font-medium">Điện thoại</h3>
                  <p className="text-muted-foreground">+84 123 456 789</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h3 className="font-medium">Văn phòng</h3>
                  <p className="text-muted-foreground">
                    Đại học Bách Khoa Đà Nẵng
                    <br />
                    54 Nguyễn Lương Bằng, Liên Chiểu
                    <br />
                    Đà Nẵng, Việt Nam
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Giờ làm việc</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Thứ Hai - Thứ Sáu</span>
                  <span>9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Thứ Bảy</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Chủ nhật</span>
                  <span>Đóng cửa</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Gửi tin nhắn</CardTitle>
              <CardDescription>
                Điền vào biểu mẫu bên dưới và chúng tôi sẽ trả lời bạn sớm nhất có thể.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại (tùy chọn)</Label>
                  <Input
                    id="phone"
                    placeholder="Số điện thoại của bạn"
                    {...register("phone")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Chủ đề</Label>
                  <Input
                    id="subject"
                    placeholder="Điều gì đang liên quan?"
                    {...register("subject", {
                      required: "Subject is required",
                    })}
                  />
                  {errors.subject && (
                    <p className="text-sm text-destructive">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Tin nhắn</Label>
                  <Textarea
                    id="message"
                    placeholder="Vui lòng cung cấp chi tiết về câu hỏi của bạn..."
                    rows={5}
                    {...register("message", {
                      required: "Message is required",
                      minLength: {
                        value: 10,
                        message: "Message must be at least 10 characters",
                      },
                    })}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                      Gửi...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Gửi tin nhắn
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
