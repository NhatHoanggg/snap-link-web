"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import LocationSelector from "@/components/common/location-selector";
import { UpdateProfileData, userService } from "@/services/user.service";
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
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileData>({
    full_name: "",
    phone_number: "",
    province: "",
    district: "",
    ward: "",
    address_detail: "",
  });

  const [location, setLocation] = useState<{
    province: Province | null;
    district: District | null;
    ward: Ward | null;
  }>({
    province: null,
    district: null,
    ward: null,
  });

  const [errors, setErrors] = useState<{
    full_name?: string;
    phone_number?: string;
    province?: string;
    district?: string;
    ward?: string;
    address_detail?: string;
  }>({});

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const profile = await userService.getProfile();
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
        toast.error("Không thể tải thông tin hồ sơ");
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

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!formData.full_name?.trim()) {
      newErrors.full_name = "Họ tên không được để trống";
    }
    if (!formData.phone_number?.trim()) {
      newErrors.phone_number = "Số điện thoại không được để trống";
    } else if (!/^\d{10}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Số điện thoại không hợp lệ";
    }
    if (!formData.province) {
      newErrors.province = "Vui lòng chọn tỉnh/thành phố";
    }
    if (!formData.district) {
      newErrors.district = "Vui lòng chọn quận/huyện";
    }
    if (!formData.ward) {
      newErrors.ward = "Vui lòng chọn phường/xã";
    }
    if (!formData.address_detail?.trim()) {
      newErrors.address_detail = "Địa chỉ chi tiết không được để trống";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setUpdating(true);
    try {
      const response = await userService.updateProfile(
        formData,
        user?.role as "customer" | "photographer"
      );
      console.log("Profile updated:", response);
      toast.success("Cập nhật thông tin thành công");
      router.push("/profile");
    } catch (err) {
      console.error("Error updating profile", err);
      toast.error("Cập nhật thông tin thất bại");
    } finally {
      setUpdating(false);
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
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                placeholder="Nhập họ tên"
              />
              {errors.full_name && (
                <p className="text-sm text-red-500">{errors.full_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Số điện thoại</Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
                placeholder="Nhập số điện thoại"
              />
              {errors.phone_number && (
                <p className="text-sm text-red-500">{errors.phone_number}</p>
              )}
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
                value={formData.address_detail || ""}
                onChange={(e) =>
                  setFormData({ ...formData, address_detail: e.target.value })
                }
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
              <Button type="submit" className="" disabled={updating}>
                {updating ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900"></div>
                    Đang cập nhật...
                  </div>
                ) : (
                  "Cập nhật thông tin"
                )}
              </Button>
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
