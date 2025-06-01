'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  Calendar, 
  MapPin, 
  Package, 
  PenTool, 
  Send, 
  CheckCircle, 
  CreditCard, 
  Mail,
  ArrowRight,
  Users,
  Clock,
  Star
} from 'lucide-react';

const PhotoBookingGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 1,
      title: "Chọn Nhiếp Ảnh Gia",
      description: "Tìm và chọn nhiếp ảnh gia phù hợp với phong cách của bạn",
      icon: <Camera className="w-6 h-6" />,
      color: "bg-primary",
      details: [
        "Xem portfolio và đánh giá của nhiếp ảnh gia",
        "So sánh giá cả và phong cách chụp",
        "Kiểm tra lịch trình có sẵn"
      ]
    },
    {
      id: 2,
      title: "Chọn Ngày Chụp",
      description: "Lựa chọn ngày giờ phù hợp với cả bạn và nhiếp ảnh gia",
      icon: <Calendar className="w-6 h-6" />,
      color: "bg-secondary",
      details: [
        "Xem lịch trống của nhiếp ảnh gia",
        "Chọn múi giờ và thời gian cụ thể",
        "Dự trữ thời gian backup nếu cần"
      ]
    },
    {
      id: 3,
      title: "Chọn Địa Điểm",
      description: "Quyết định nơi thực hiện buổi chụp hình",
      icon: <MapPin className="w-6 h-6" />,
      color: "bg-accent",
      details: [
        "Studio chuyên nghiệp hoặc ngoại cảnh",
        "Kiểm tra điều kiện ánh sáng và không gian",
        "Xác nhận phí địa điểm (nếu có)"
      ]
    },
    {
      id: 4,
      title: "Chọn Gói Dịch Vụ",
      description: "Lựa chọn gói chụp phù hợp với nhu cầu và ngân sách",
      icon: <Package className="w-6 h-6" />,
      color: "bg-primary",
      details: [
        "Số lượng ảnh được chỉnh sửa",
        "Thời gian chụp và số outfit",
        "Các dịch vụ bổ sung như makeup, styling"
      ]
    },
    {
      id: 5,
      title: "Concept & Ý Tưởng",
      description: "Mô tả concept và chia sẻ hình ảnh tham khảo",
      icon: <PenTool className="w-6 h-6" />,
      color: "bg-secondary",
      details: [
        "Mô tả phong cách và tông màu mong muốn",
        "Upload ảnh reference và mood board",
        "Thảo luận về trang phục và phụ kiện"
      ]
    },
    {
      id: 6,
      title: "Gửi Yêu Cầu",
      description: "Gửi thông tin đặt chụp và chờ xác nhận",
      icon: <Send className="w-6 h-6" />,
      color: "bg-accent",
      details: [
        "Kiểm tra lại tất cả thông tin",
        "Gửi yêu cầu đến nhiếp ảnh gia",
        "Chờ phản hồi trong 24h"
      ]
    },
    {
      id: 7,
      title: "Xác Nhận Booking",
      description: "Nhiếp ảnh gia xác nhận và cung cấp thông tin chi tiết",
      icon: <CheckCircle className="w-6 h-6" />,
      color: "bg-primary",
      details: [
        "Nhận thông tin chi tiết buổi chụp",
        "Xác nhận địa điểm và thời gian",
        "Thảo luận về yêu cầu đặc biệt"
      ]
    },
    {
      id: 8,
      title: "Thanh Toán",
      description: "Chọn hình thức thanh toán phù hợp",
      icon: <CreditCard className="w-6 h-6" />,
      color: "bg-secondary",
      details: [
        "Thanh toán 100% toàn bộ chi phí",
        "Hoặc thanh toán 20% để giữ chỗ",
        "Nhận hóa đơn và xác nhận thanh toán"
      ]
    },
    {
      id: 9,
      title: "Nhận Ảnh",
      description: "Nhận thông báo và xem ảnh đã chỉnh sửa",
      icon: <Mail className="w-6 h-6" />,
      color: "bg-accent",
      details: [
        "Nhận email thông báo khi ảnh hoàn thành",
        "Thanh toán phần còn lại (nếu chọn trả góp)",
        "Download ảnh chất lượng cao"
      ]
    }
  ];

  const paymentOptions = [
    {
      title: "Thanh Toán Toàn Bộ",
      description: "Thanh toán 100% ngay khi xác nhận",
      benefits: ["Không cần thanh toán thêm", "Ưu tiên cao"],
      color: "border-primary/20 bg-primary/5"
    },
    {
      title: "Thanh Toán Giữ Chỗ",
      description: "Thanh toán 20% để xác nhận booking",
      benefits: ["Linh hoạt thanh toán", "Giữ chỗ đảm bảo", "Thanh toán khi nhận ảnh"],
      color: "border-secondary/20 bg-secondary/5"
    }
  ];

  const progressValue = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Camera className="w-8 h-8 text-primary mr-3" />
              <h1 className="text-3xl font-bold text-foreground">Hướng Dẫn Đặt Chụp Ảnh</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Quy trình đơn giản và rõ ràng để đặt buổi chụp ảnh chuyên nghiệp
            </p>
            
            {/* Progress Bar */}
            <div className="mt-8 max-w-md mx-auto">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Bước {currentStep + 1}/{steps.length}</span>
                <span>{Math.round(progressValue)}%</span>
              </div>
              <Progress value={progressValue} className="h-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Step-by-step Guide */}
        <div className="space-y-6 mb-16">
          {steps.map((step, index) => (
            <Card 
              key={step.id} 
              className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${
                index === currentStep ? 'ring-2 ring-primary shadow-lg' : ''
              }`}
              onClick={() => setCurrentStep(index)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full text-primary-foreground ${step.color}`}>
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <CardTitle className="text-xl text-foreground">{step.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        Bước {step.id}
                      </Badge>
                    </div>
                    <CardDescription className="text-base mt-1 text-muted-foreground">
                      {step.description}
                    </CardDescription>
                  </div>
                  {index === currentStep && (
                    <ArrowRight className="w-5 h-5 text-primary" />
                  )}
                </div>
              </CardHeader>
              
              {index === currentStep && (
                <CardContent>
                  <div className="ml-16">
                    <h4 className="font-semibold text-foreground mb-3">Chi tiết thực hiện:</h4>
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Payment Options */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Lựa Chọn Thanh Toán
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {paymentOptions.map((option, index) => (
              <Card key={index} className={`${option.color} border-2 hover:shadow-lg transition-shadow`}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-foreground">
                    <CreditCard className="w-5 h-5" />
                    <span>{option.title}</span>
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {option.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Tại Sao Chọn Chúng Tôi?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Nhiếp Ảnh Gia Chuyên Nghiệp</h3>
              <p className="text-muted-foreground text-sm">Đội ngũ nhiếp ảnh gia giàu kinh nghiệm và tài năng</p>
            </div>
            
            <div className="text-center">
              <div className="bg-secondary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Quy Trình Nhanh Chóng</h3>
              <p className="text-muted-foreground text-sm">Đặt lịch dễ dàng và nhận ảnh trong thời gian ngắn</p>
            </div>
            
            <div className="text-center">
              <div className="bg-accent/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Chất Lượng Đảm Bảo</h3>
              <p className="text-muted-foreground text-sm">Ảnh chất lượng cao và dịch vụ chỉnh sửa chuyên nghiệp</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center space-x-4 mt-12">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Bước Trước
          </Button>
          <Button 
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
          >
            Bước Tiếp
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhotoBookingGuide;