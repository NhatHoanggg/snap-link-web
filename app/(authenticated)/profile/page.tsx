"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { userService, type UserProfile } from "@/services/user.service";
import { useAuth } from "@/services/auth";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

import {
  MoreVertical,
  ImageIcon,
  Camera,
  Edit2,
  MapPin,
  Mail,
  Phone,
  User,
  Clock,
  Tag,
  Briefcase,
  Calendar,
  Share2,
  Settings,
  Loader2,
  Globe,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const router = useRouter();
  const { token, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<"avatar" | "background" | null>(
    null
  );

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await userService.getProfile();
        setProfile(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải thông tin hồ sơ",
        });
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthLoading) {
      fetchProfile();
    }
  }, [token, isAuthLoading, router, toast]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading("avatar");
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "snaplink"
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("Uploaded image URL:", data.secure_url);

      // Update profile with new avatar
      if (token) {
        await userService.updateProfile(
          { ...profile, avatar: data.secure_url },
          profile?.role as "customer" | "photographer"
        );
        setProfile((prev) =>
          prev ? { ...prev, avatar: data.secure_url } : null
        );
        toast({
          title: "Thành công",
          description: "Cập nhật ảnh đại diện thành công",
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Cập nhật ảnh đại diện thất bại",
      });
    } finally {
      setUploading(null);
    }
  };

  const handleBackgroundUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading("background");
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "snaplink"
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("Uploaded background URL:", data.secure_url);

      // Update profile with new background
      if (token) {
        await userService.updateProfile(
          { ...profile, background_image: data.secure_url },
          profile?.role as "customer" | "photographer"
        );
        setProfile((prev) =>
          prev ? { ...prev, background_image: data.secure_url } : null
        );
        toast({
          title: "Thành công",
          description: "Cập nhật ảnh bìa thành công",
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Cập nhật ảnh bìa thất bại",
      });
    } finally {
      setUploading(null);
    }
  };

  if (isAuthLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="relative h-48">
            <Skeleton className="h-full w-full rounded-t-lg" />
            <div className="absolute -bottom-16 left-8">
              <Skeleton className="w-32 h-32 rounded-full border-4 border-white" />
            </div>
          </CardHeader>
          <CardContent className="pt-20 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-10 w-24" />
            </div>
            <Separator />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!token || !profile) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md max-w-md mx-auto">
          <p className="font-medium">Không thể tải thông tin hồ sơ</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/login")}
          >
            Đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  const formatAddress = () => {
    const parts = [
      profile.address_detail,
      profile.ward,
      profile.district,
      profile.province,
    ].filter(Boolean);
    return parts.join(", ") || "Chưa cập nhật";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto overflow-hidden">
        <CardHeader className="relative h-80 p-0">
          <div className="absolute inset-0">
            <Image
              src={
                profile.background_image ||
                "/placeholder.svg?height=400&width=1200"
              }
              alt="Background"
              className="object-cover w-full h-full"
              fill
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          <input
            type="file"
            id="background"
            accept="image/*"
            onChange={handleBackgroundUpload}
            className="hidden"
          />

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 bg-white/80 hover:bg-white"
            onClick={() => document.getElementById("background")?.click()}
            disabled={uploading !== null}
          >
            {uploading === "background" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </Button>
        </CardHeader>

        <div className="relative px-8">
          <div className="absolute -top-16 flex items-end gap-4">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage
                  src={
                    profile.avatar || "/placeholder.svg?height=128&width=128"
                  }
                  alt={profile.full_name}
                />
                <AvatarFallback className="text-4xl">
                  {profile.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute bottom-0 right-0 bg-white/80 hover:bg-white h-8 w-8"
                onClick={() => document.getElementById("avatar")?.click()}
                disabled={uploading !== null}
              >
                {uploading === "avatar" ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Camera className="h-3 w-3" />
                )}
              </Button>
            </div>
            <div className="pb-4">
              <h1 className="text-2xl font-bold">{profile.full_name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={
                    profile.role === "photographer" ? "default" : "outline"
                  }
                >
                  {profile.role === "photographer"
                    ? "Nhiếp ảnh gia"
                    : "Khách hàng"}
                </Badge>
                {profile.role === "photographer" &&
                  profile.experience_years && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Clock className="h-3 w-3" />
                      {profile.experience_years} năm kinh nghiệm
                    </Badge>
                  )}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4 mb-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => router.push("/profile/edit")}
              >
                <Edit2 className="h-3.5 w-3.5" />
                Chỉnh sửa hồ sơ
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <MoreVertical className="h-3.5 w-3.5" />
                    <span className="sr-only md:not-sr-only">Tùy chọn</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60 p-2 space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() =>
                      profile.avatar && window.open(profile.avatar, "_blank")
                    }
                    disabled={!profile.avatar}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Xem ảnh đại diện
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() =>
                      profile.background_image &&
                      window.open(profile.background_image, "_blank")
                    }
                    disabled={!profile.background_image}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Xem ảnh bìa
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => document.getElementById("avatar")?.click()}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Sửa ảnh đại diện
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() =>
                      document.getElementById("background")?.click()
                    }
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Sửa ảnh bìa
                  </Button>
                  <Separator />
                  <Button variant="ghost" className="w-full justify-start">
                    <Share2 className="mr-2 h-4 w-4" />
                    Chia sẻ hồ sơ
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Cài đặt tài khoản
                  </Button>
                  {profile.role === "photographer" && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => router.push("/profile/portfolio")}
                    >
                      <Briefcase className="mr-2 h-4 w-4" />
                      Quản lý hồ sơ công việc
                    </Button>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <CardContent className="pt-8">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="info" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Thông tin cá nhân
              </TabsTrigger>
              {profile.role === "photographer" && (
                <TabsTrigger
                  value="professional"
                  className="flex items-center gap-1"
                >
                  <Camera className="h-4 w-4" />
                  Thông tin chuyên môn
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="info" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard
                  icon={<Mail className="h-4 w-4 text-primary" />}
                  label="Email"
                  value={profile.email}
                />
                <InfoCard
                  icon={<Phone className="h-4 w-4 text-primary" />}
                  label="Số điện thoại"
                  value={profile.phone_number}
                  placeholder="Chưa cập nhật"
                />
              </div>

              <InfoCard
                icon={<MapPin className="h-4 w-4 text-primary" />}
                label="Địa chỉ"
                value={formatAddress()}
                placeholder="Chưa cập nhật"
              />

              {profile.role === "photographer" &&
                profile.social_media_links && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Globe className="h-4 w-4 text-primary" /> Liên kết mạng xã hội
                    </h3>
                    {Object.keys(profile.social_media_links).length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(profile.social_media_links).map(
                          ([platform, url]) => (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors"
                            >
                              <span>{platform}</span>
                            </a>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Chưa cập nhật liên kết mạng xã hội
                      </p>
                    )}
                  </div>
                )}
            </TabsContent>

            {profile.role === "photographer" && (
              <TabsContent value="professional" className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" /> Giới thiệu
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-4">
                    {profile.bio ? (
                      <p className="text-sm whitespace-pre-line">
                        {profile.bio}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        Chưa cập nhật giới thiệu
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" /> Chuyên môn nhiếp
                    ảnh
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.tags && profile.tags.length > 0 ? (
                      profile.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Chưa cập nhật chuyên môn
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoCard
                    icon={<Clock className="h-4 w-4 text-primary" />}
                    label="Giá mỗi giờ"
                    value={
                      profile.price_per_hour
                        ? `${profile.price_per_hour.toLocaleString()} VND`
                        : undefined
                    }
                    placeholder="Chưa cập nhật"
                  />
                  <InfoCard
                    icon={<Calendar className="h-4 w-4 text-primary" />}
                    label="Số năm kinh nghiệm"
                    value={
                      profile.experience_years
                        ? `${profile.experience_years} năm`
                        : undefined
                    }
                    placeholder="Chưa cập nhật"
                  />
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value?: string | number | null;
  placeholder?: string;
}

function InfoCard({
  icon,
  label,
  value,
  placeholder = "Chưa cập nhật",
}: InfoCardProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium flex items-center gap-2">
        {icon} {label}
      </h3>
      <div className="bg-muted/30 rounded-lg p-4">
        <p
          className={`text-sm ${!value ? "text-muted-foreground italic" : ""}`}
        >
          {value || placeholder}
        </p>
      </div>
    </div>
  );
}
