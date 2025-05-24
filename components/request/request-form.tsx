"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CreateRequest } from "@/services/request.service";
import { uploadImage } from "@/services/cloudinary.service";
import { Loader2, Upload, CheckCircle2, Check, ChevronsUpDown } from "lucide-react";
import toast, { Toaster, ToastBar } from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Province {
  name: string;
  code: number;
}

interface RequestFormProps {
  selectedDate: Date | null;
  onSubmit: (data: Omit<CreateRequest, "request_date">) => void;
  onBack: () => void;
}

export function RequestForm({
  selectedDate,
  onSubmit,
  onBack,
}: RequestFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<CreateRequest, "request_date">>({
    concept: "",
    estimated_budget: 0,
    shooting_type: "outdoor",
    illustration_url: "",
    location_text: "",
    province: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [openCityPopover, setOpenCityPopover] = useState(false);

  useEffect(() => {
    fetch("/data/vietnam.json")
      .then((res) => res.json())
      .then((data: Province[]) => {
        setProvinces(data);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Không thể gửi yêu cầu. Vui lòng thử lại sau.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "estimated_budget" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const imageUrl = await uploadImage(file, "snaplink");
      setFormData((prev) => ({
        ...prev,
        illustration_url: imageUrl,
      }));
      setPreviewUrl(imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Không thể tải lên ảnh. Vui lòng thử lại sau.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleGoHome = () => {
    router.push("/home");
  };

  const handleCreateNew = () => {
    setShowSuccessDialog(false);
    router.refresh();
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Thông tin yêu cầu</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {selectedDate && (
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">
                Ngày chụp:{" "}
                {format(selectedDate, "EEEE, dd MMMM yyyy", { locale: vi })}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="concept">Concept chụp ảnh</Label>
            <Textarea
              id="concept"
              name="concept"
              value={formData.concept}
              onChange={handleChange}
              placeholder="Mô tả concept chụp ảnh của bạn..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimated_budget">Ngân sách dự kiến (VNĐ)</Label>
            <Input
              id="estimated_budget"
              name="estimated_budget"
              type="number"
              value={formData.estimated_budget || ""}
              onChange={handleChange}
              placeholder="Nhập ngân sách dự kiến..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shooting_type">Loại hình chụp ảnh</Label>
            <Select
              value={formData.shooting_type}
              onValueChange={(value) => {
                handleSelectChange("shooting_type", value);
                if (value === "studio") {
                  setFormData(prev => ({
                    ...prev,
                    location_text: ""
                  }));
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại hình chụp ảnh" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="outdoor">Ngoại cảnh</SelectItem>
                {/* <SelectItem value="indoor">Trong nhà</SelectItem> */}
                <SelectItem value="studio">Studio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="illustration">Ảnh tham khảo</Label>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Input
                  id="illustration"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                />
                <Label
                  htmlFor="illustration"
                  className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-muted"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>{isUploading ? "Đang tải lên..." : "Chọn ảnh"}</span>
                </Label>
              </div>
              {previewUrl && (
                <div className="relative w-full h-48 rounded-md overflow-hidden">
                  <Image
                    src={previewUrl}
                    alt="Ảnh tham khảo"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {formData.shooting_type === "outdoor" && (
            <div className="space-y-2">
              <Label htmlFor="location_text">Địa điểm chụp</Label>
              <Input
                id="location_text"
                name="location_text"
                value={formData.location_text}
                onChange={handleChange}
                placeholder="Nhập địa điểm chụp..."
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Thành phố</Label>
            <Popover open={openCityPopover} onOpenChange={setOpenCityPopover}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCityPopover}
                  className="w-full justify-between"
                >
                  {selectedProvince?.name || "Chọn thành phố..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Tìm thành phố..." />
                  <CommandList>
                    <CommandEmpty>Không tìm thấy thành phố.</CommandEmpty>
                    <CommandGroup>
                      {provinces.map((province) => (
                        <CommandItem
                          key={province.code}
                          value={province.name}
                          onSelect={() => {
                            setSelectedProvince(province);
                            setFormData((prev) => ({
                              ...prev,
                              province: province.name,
                            }));
                            setOpenCityPopover(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedProvince?.code === province.code
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {province.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between mt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Quay lại
          </Button>
          <Button type="submit">Gửi yêu cầu</Button>
        </CardFooter>
      </form>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              Gửi yêu cầu thành công
            </DialogTitle>
            <DialogDescription>
              Yêu cầu của bạn đã được gửi thành công. Bạn muốn làm gì tiếp theo?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleGoHome}
              className="flex-1"
            >
              Về trang chủ
            </Button>
            <Button
              onClick={handleCreateNew}
              className="flex-1"
            >
              Tạo yêu cầu mới
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster position="bottom-right">
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                {t.type !== "loading" && (
                  <button onClick={() => toast.dismiss(t.id)}>X</button>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
    </>
  );
}
