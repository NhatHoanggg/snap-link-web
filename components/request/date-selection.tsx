"use client";

import { useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, Loader2 } from "lucide-react";
import toast, { Toaster, ToastBar } from "react-hot-toast";
import { photographerService, Photographer } from "@/services/photographer.service"; 
import { useRouter } from "next/navigation";
import Image from "next/image";

interface DateSelectionProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  nextStep: () => void;
}

export function DateSelection({ selectedDate, onDateSelect, nextStep }: DateSelectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const router = useRouter();

  const fetchPhotographers = async (date: Date) => {
    try {
      setIsLoading(true);
      const formattedDate = format(date, "yyyy-MM-dd");
      const response = await photographerService.getPhotographersByDate(formattedDate, 0, 100);
      setPhotographers(response.photographers);
    } catch (error) {
      console.error("Error fetching photographers:", error);
      toast.error("Không thể tải danh sách nhiếp ảnh gia. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateSelect(date);
      fetchPhotographers(date);
    }
  };

  const handlePhotographerSelect = (photographer: Photographer) => {
    router.push(`/photographers/${photographer.slug}`);
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Chọn ngày chụp</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            <Calendar
              mode="single"
              selected={selectedDate || undefined}
              onSelect={handleDateSelect}
              month={selectedDate || undefined}
              className="rounded-md border"
            />

            {selectedDate && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                  <span className="font-medium">Ngày đã chọn:</span>
                  <span className="ml-2">
                    {format(selectedDate, "EEEE, dd MMMM yyyy", { locale: vi })}
                  </span>
                </div>
              </div>
            )}

            {photographers.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Danh sách nhiếp ảnh gia có sẵn</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {photographers.map((photographer) => (
                    <div
                      key={photographer.photographer_id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handlePhotographerSelect(photographer)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden">
                          <Image
                            src={photographer.avatar || "/placeholder-avatar.jpg"}
                            alt={photographer.full_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{photographer.full_name}</h4>
                          <p className="text-sm text-gray-500">{photographer.province}</p>
                          <p className="text-sm text-gray-500">{photographer.address_detail}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1 text-sm">{photographer.average_rating}</span>
                            <span className="ml-1 text-sm text-gray-500">
                              ({photographer.total_reviews} đánh giá)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {photographers.length === 0 && (
              <div className="mt-6">
                <p className="text-lg font-semibold mb-4">Không có nhiếp ảnh gia nào có sẵn trong ngày đã chọn.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between mt-4">
        <div></div>
        <Button
          onClick={nextStep}
          disabled={!selectedDate || isLoading}
        >
          Tiếp theo
        </Button>
      </CardFooter>
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