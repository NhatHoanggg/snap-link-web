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

interface SocialMediaLinks {
  [key: string]: string;
}

interface PhotographerProfileData extends UpdateProfileData {
  price_per_hour?: number | null;
  experience_year?: number | null;
  social_media_links?: SocialMediaLinks;
  tags?: string[];
}

export default function EditProfilePage() {
  const { token, user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState<PhotographerProfileData>({
    full_name: "",
    phone_number: "",
    province: "",
    district: "",
    ward: "",
    address_detail: "",
    price_per_hour: 0,
    experience_year: 0,
    social_media_links: {},
    tags: [],
  });
  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMediaLinks>({});

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
    price_per_hour?: string;
    experience_year?: string;
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
          price_per_hour: profile.price_per_hour || 0,
          experience_year: profile.experience_year || 0,
          tags: profile.tags || [],
        });
        // TODO: Fetch social media links from a separate API endpoint
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
    if (user?.role === "photographer") {
      if (formData.price_per_hour === undefined || formData.price_per_hour === null || formData.price_per_hour < 0) {
        newErrors.price_per_hour = "Giá mỗi giờ phải là số dương";
      }
      if (formData.experience_year === undefined || formData.experience_year === null || formData.experience_year < 0) {
        newErrors.experience_year = "Số năm kinh nghiệm phải là số dương";
      }
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

            {user?.role === "photographer" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="price_per_hour">Giá mỗi giờ (VNĐ)</Label>
                  <Input
                    id="price_per_hour"
                    type="number"
                    min="0"
                    value={formData.price_per_hour || 0}
                    onChange={(e) =>
                      setFormData({ ...formData, price_per_hour: parseInt(e.target.value) })
                    }
                    placeholder="Nhập giá mỗi giờ"
                  />
                  {errors.price_per_hour && (
                    <p className="text-sm text-red-500">{errors.price_per_hour}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience_year">Số năm kinh nghiệm</Label>
                  <Input
                    id="experience_year"
                    type="number"
                    min="0"
                    value={formData.experience_year || 0}
                    onChange={(e) =>
                      setFormData({ ...formData, experience_year: parseInt(e.target.value) })
                    }
                    placeholder="Nhập số năm kinh nghiệm"
                  />
                  {errors.experience_year && (
                    <p className="text-sm text-red-500">{errors.experience_year}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</Label>
                  <Input
                    id="tags"
                    value={formData.tags?.join(", ") || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tags: e.target.value.split(",").map((tag) => tag.trim()),
                      })
                    }
                    placeholder="Nhập các tags, phân cách bằng dấu phẩy"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Liên kết mạng xã hội</Label>
                  <div className="space-y-4">
                    {Object.entries(socialMediaLinks).map(([platform, link]) => (
                      <div key={platform} className="flex gap-2">
                        <Input
                          value={platform}
                          onChange={(e) => {
                            const newLinks = { ...socialMediaLinks };
                            delete newLinks[platform];
                            newLinks[e.target.value] = link;
                            setSocialMediaLinks(newLinks);
                          }}
                          placeholder="Nền tảng"
                        />
                        <Input
                          value={link}
                          onChange={(e) => {
                            setSocialMediaLinks({
                              ...socialMediaLinks,
                              [platform]: e.target.value,
                            });
                          }}
                          placeholder="URL"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const newLinks = { ...socialMediaLinks };
                            delete newLinks[platform];
                            setSocialMediaLinks(newLinks);
                          }}
                        >
                          Xóa
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSocialMediaLinks({
                          ...socialMediaLinks,
                          "": "",
                        });
                      }}
                    >
                      Thêm liên kết
                    </Button>
                  </div>
                </div>
              </>
            )}

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
