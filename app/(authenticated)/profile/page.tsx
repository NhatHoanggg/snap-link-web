"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { userService, UserProfile } from "@/services/user.service";
import { useAuth } from "@/services/auth";

import { MoreVertical, Image as ImageIcon, Camera, Edit2 } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { token, isLoading: isAuthLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await userService.getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthLoading) {
      fetchProfile();
    }
  }, [token, isAuthLoading, router]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
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
        toast.success("Cập nhật ảnh đại diện thành công");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Cập nhật ảnh đại diện thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleBackgroundUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
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
        toast.success("Cập nhật ảnh bìa thành công");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Cập nhật ảnh bìa thất bại");
    } finally {
      setUploading(false);
    }
  };

  if (isAuthLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!token || !profile) {
    return <div>Error loading profile</div>;
  }

  const formatLocation = () => {
    const parts = [profile.ward, profile.district, profile.province].filter(
      Boolean
    );
    return parts.join(", ") || "Chưa cập nhật";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="relative h-48">
          <Image
            src={profile.background_image || "/default-bg.jpg"}
            alt="Background"
            fill
            className="object-cover rounded-t-lg"
          />
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
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={() => document.getElementById("background")?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900"></div>
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </Button>
          <div className="absolute -bottom-16 left-8">
            <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden">
              <Image
                src={profile.avatar || "/default-avatar.jpg"}
                alt={profile.full_name}
                fill
                className="object-cover"
              />
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
                className="absolute bottom-2 right-2 bg-white/80 hover:bg-white"
                onClick={() => document.getElementById("avatar")?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900"></div>
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-20 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={profile.full_name} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profile.email} readOnly />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input value={profile.phone_number || "Chưa cập nhật"} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={formatLocation()} readOnly />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Detailed Address</Label>
            <Input value={profile.address_detail || "Chưa cập nhật"} readOnly />
          </div>

          {profile.role === "photographer" && (
            <>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  value={profile.bio || "Chưa cập nhật"}
                  readOnly
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price per Hour (VND)</Label>
                  <Input
                    value={
                      profile.price_per_hour?.toLocaleString() ||
                      "Chưa cập nhật"
                    }
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label>Experience Years</Label>
                  <Input
                    value={profile.experience_year || "Chưa cập nhật"}
                    readOnly
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>

        <div className="flex justify-end mt-6 mb-4 mr-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <MoreVertical className="h-4 w-4" />
                Tùy chọn
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-2 space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() =>
                  profile.avatar && window.open(profile.avatar, "_blank")
                }
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
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Xem ảnh bìa
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => alert("TODO: Mở modal thay ảnh đại diện")}
              >
                <Camera className="mr-2 h-4 w-4" />
                Sửa ảnh đại diện
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => alert("TODO: Mở modal thay ảnh bìa")}
              >
                <Camera className="mr-2 h-4 w-4" />
                Sửa ảnh bìa
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => router.push("/profile/edit")}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Chỉnh sửa thông tin
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </Card>
    </div>
  );
}
