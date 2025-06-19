"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Users,
  Award,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  const features = [
    {
      title: "Đặt Lịch Dễ Dàng",
      description:
        "Lên lịch chụp ảnh với nhiếp ảnh gia yêu thích chỉ trong vài cú nhấp chuột.",
      icon: <Calendar className="h-12 w-12 text-primary" />,
    },
    {
      title: "Hồ Sơ Nhiếp Ảnh Gia",
      description:
        "Duyệt qua các portfolio chi tiết và đánh giá để tìm người phù hợp nhất với nhu cầu của bạn.",
      icon: <Users className="h-12 w-12 text-primary" />,
    },
    {
      title: "Đảm Bảo Chất Lượng",
      description:
        "Nhiếp ảnh gia đã được xác minh với đánh giá và nhận xét từ khách hàng trước đó.",
      icon: <Award className="h-12 w-12 text-primary" />,
    },
    {
      title: "Lên Lịch Thời Gian Thực",
      description:
        "Xem lịch trống của nhiếp ảnh gia theo thời gian thực và chọn khung giờ hoàn hảo.",
      icon: <Clock className="h-12 w-12 text-primary" />,
    },
  ];

  const teamMembers = [
    {
      name: "Nguyễn Đắc Nhật Hoàng",
      role: "Lập Trình Viên",
      bio: "Sinh viên Đại học Bách Khoa, khoa Công nghệ Thông tin, chuyên ngành Công Nghệ Phần Mềm.",
      image: "/images/my-avt.jpg",
    },
    {
      name: "ThS. Nguyễn Văn Nguyên",
      role: "Giảng Viên Hướng Dẫn",
      bio: "Thạc sĩ và giảng viên tại Đại học Bách Khoa, hướng dẫn quá trình phát triển.",
      image: "/images/ths-nguyen-van-nguyen.jpg",
    },
  ];

  return (
    <div>
      <div className="container mx-auto py-12 px-4 md:px-6 mt-16">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="w-full md:w-1/2">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Kết Nối Nhiếp Ảnh Gia & Khách Hàng
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Nền tảng của chúng tôi cách mạng hóa cách đặt dịch vụ chụp ảnh,
              giúp việc tìm nhiếp ảnh gia hoàn hảo cho nhu cầu của bạn và quản lý
              toàn bộ quá trình trực tuyến trở nên dễ dàng hơn bao giờ hết.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/photographers">Xem Nhiếp Ảnh Gia</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Liên Hệ Chúng Tôi</Link>
              </Button>
            </div>
          </div>
          <div className="w-full md:w-1/2 relative h-64 md:h-96 rounded-lg overflow-hidden border">
            <Image
              src="/images/pg1.jpg"
              alt="Nhiếp ảnh gia đang làm việc"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Mission and Vision */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Sứ Mệnh & Tầm Nhìn
          </h2>
          <Tabs defaultValue="mission" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mission">Sứ Mệnh</TabsTrigger>
              <TabsTrigger value="vision">Tầm Nhìn</TabsTrigger>
            </TabsList>
            <TabsContent
              value="mission"
              className="p-6 bg-muted/50 rounded-b-lg"
            >
              <h3 className="text-xl font-semibold mb-3">Sứ Mệnh Của Chúng Tôi</h3>
              <p className="text-muted-foreground">
                Tạo ra sự kết nối mượt mà giữa nhiếp ảnh gia và khách hàng,
                tối ưu hóa quy trình đặt lịch và nâng cao trải nghiệm dịch vụ
                chụp ảnh cho cả hai bên. Chúng tôi mong muốn cung cấp một nền
                tảng giúp nhiếp ảnh gia trưng bày tác phẩm và quản lý công việc
                kinh doanh trong khi mang đến cho khách hàng cách dễ dàng để
                tìm nhiếp ảnh gia hoàn hảo cho nhu cầu cụ thể của họ.
              </p>
            </TabsContent>
            <TabsContent
              value="vision"
              className="p-6 bg-muted/50 rounded-b-lg"
            >
              <h3 className="text-xl font-semibold mb-3">Tầm Nhìn Của Chúng Tôi</h3>
              <p className="text-muted-foreground">
                Chúng tôi hình dung một tương lai nơi việc đặt dịch vụ chụp ảnh
                đơn giản như đặt đồ ăn trực tuyến. Nền tảng của chúng tôi sẽ
                trở thành thị trường hàng đầu cho dịch vụ chụp ảnh tại Việt Nam
                và xa hơn, hỗ trợ sự phát triển của ngành công nghiệp sáng tạo
                và cho phép nhiếp ảnh gia tập trung vào nghề thủ công trong khi
                chúng tôi xử lý các khía cạnh kinh doanh. Thông qua tích hợp
                công nghệ và kết nối thông minh, chúng tôi mong muốn nâng cao
                tiêu chuẩn dịch vụ chụp ảnh trên toàn quốc.
              </p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Tính Năng Chính</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-t-4 border-primary">
                <CardHeader className="flex flex-row items-center gap-4">
                  {feature.icon}
                  <div>
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Cách Thức Hoạt Động</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Tìm Nhiếp Ảnh Gia
              </h3>
              <p className="text-muted-foreground">
                Duyệt qua danh sách nhiếp ảnh gia chuyên nghiệp của chúng tôi.
                Lọc theo địa điểm, phong cách, chuyên môn và lịch trống để tìm
                người phù hợp nhất.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Đặt Lịch Chụp</h3>
              <p className="text-muted-foreground">
                Chọn từ các khung giờ có sẵn, chọn gói dịch vụ và hoàn thành
                đặt lịch chỉ với vài bước đơn giản. Nhận xác nhận ngay lập tức.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Nhận Ảnh</h3>
              <p className="text-muted-foreground">
                Sau buổi chụp, truy cập và tải xuống ảnh của bạn trực tiếp từ
                nền tảng. Chia sẻ, tải xuống hoặc đặt in ảnh một cách dễ dàng.
              </p>
            </div>
          </div>
        </div>

        {/* For Photographers Section */}
        <div className="mb-16 bg-muted/30 p-8 rounded-lg">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Dành Cho Nhiếp Ảnh Gia</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Bạn có phải là nhiếp ảnh gia chuyên nghiệp muốn tìm kiếm
                khách hàng? Tham gia nền tảng của chúng tôi để:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  Trưng bày portfolio cho khách hàng tiềm năng
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  Quản lý đặt lịch và lịch trình hiệu quả
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  Giao ảnh cho khách hàng thông qua nền tảng an toàn
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  Nhận đánh giá và xây dựng danh tiếng
                </li>
              </ul>
              <Button asChild>
                <Link href="/auth/register">Tham Gia Làm Nhiếp Ảnh Gia</Link>
              </Button>
            </div>
            <div className="w-full md:w-1/2 relative h-64 md:h-80 rounded-lg overflow-hidden border">
              <Image
                src="/images/pg2.jpg"
                alt="Nhiếp ảnh gia với máy ảnh"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Đội Ngũ Dự Án</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {teamMembers.map((member, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden relative mb-4 border">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Project Info */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Về Dự Án Này
          </h2>
          <div className="bg-muted/30 p-8 rounded-lg">
            <p className="text-lg mb-6">
              Website đặt lịch chụp ảnh trực tuyến này là dự án tốt nghiệp của
              Đại học Bách Khoa, Khoa Công nghệ Thông tin. Dự án nhằm tạo ra
              một nền tảng kết nối nhiếp ảnh gia với khách hàng, tối ưu hóa
              quy trình đặt lịch và nâng cao trải nghiệm dịch vụ chụp ảnh.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Mục Tiêu Dự Án
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Xây dựng nền tảng trực tuyến hiệu quả kết nối nhiếp ảnh gia và khách hàng
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Tạo giao diện thân thiện cho việc đặt dịch vụ chụp ảnh
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Triển khai quản lý portfolio cho nhiếp ảnh gia
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Công Nghệ Sử Dụng
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <strong>Frontend:</strong> Next.js, React, shadcn/ui
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <strong>Backend:</strong> FastAPI
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <strong>Quản Lý Phiên Bản:</strong> GitHub
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-primary/5 p-12 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Sẵn Sàng Bắt Đầu?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Dù bạn đang tìm nhiếp ảnh gia hay cung cấp dịch vụ chụp ảnh,
            nền tảng của chúng tôi làm cho quá trình trở nên đơn giản và hiệu quả.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/search">Đặt Nhiếp Ảnh Gia</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/register">Tham Gia Làm Nhiếp Ảnh Gia</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
