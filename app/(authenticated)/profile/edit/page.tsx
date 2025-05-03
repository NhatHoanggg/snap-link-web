"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import LocationSelector from "@/components/common/location-selector";
import { userService } from "@/services/user.service";
import { useAuth } from "@/services/auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import toast, { Toaster } from "react-hot-toast";

interface Ward {
  name: string;
  code: number;
}

interface District {
  name: string;
  code: number;
  wards: Ward[];
}

interface Province {
  name: string;
  code: number;
  districts: District[];
}

export default function EditProfilePage() {
  const { token, user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    province: "",
    district: "",
    ward: "",
    address_detail: "",
  });
  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState<{
    province: Province | null;
    district: District | null;
    ward: Ward | null;
  }>({
    province: null,
    district: null,
    ward: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;

      try {
        const profile = await userService.getProfile(token);
        setFormData({
          full_name: profile.full_name || "",
          phone_number: profile.phone_number || "",
          province: profile.province || "",
          district: profile.district || "",
          ward: profile.ward || "",
          address_detail: profile.address_detail || "",
        });
      } catch (err) {
        console.error("Error loading profile", err);
        router.push("/profile");
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthLoading) {
      fetchProfile();
    }
  }, [token, isAuthLoading, router]);

  // Update formData when location changes
  useEffect(() => {
    if (
      location.province?.name &&
      location.district?.name &&
      location.ward?.name
    ) {
      setFormData((prev) => ({
        ...prev,
        province: location.province!.name,
        district: location.district!.name,
        ward: location.ward!.name,
      }));
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const response = await userService.updateProfile(
        formData,
        token,
        user?.role as "customer" | "photographer"
      );
      console.log("Profile updated:", response);
      toast.success("Cập nhật thông tin thành công");
      // router.push("/profile");
    } catch (err) {
      console.error("Error updating profile", err);
      toast.error("Cập nhật thông tin thất bại");
    }
  };

  if (isAuthLoading || loading) {
    return <div className="text-center p-8">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
      
        <CardHeader>
          <h2 className="text-xl font-semibold">Chỉnh sửa thông tin cá nhân</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Họ tên</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Số điện thoại</Label>
              <Input
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Địa chỉ</Label>
              <LocationSelector onChange={setLocation} />
              {formData.province && (
                <p className="text-sm text-muted-foreground">
                  {`${formData.ward}, ${formData.district}, ${formData.province}`}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_detail">Số nhà, đường, tòa nhà...</Label>
              <Input
                id="address_detail"
                name="address_detail"
                value={formData.address_detail}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/profile")}
              >
                Hủy
              </Button>
              <Button type="submit">Lưu thay đổi</Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          className: "",
          duration: 3000,
          removeDelay: 1000,
        }}
      />
    </div>
  );
}
