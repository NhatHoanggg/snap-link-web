"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookingStep1 } from "@/components/booking/booking-step-1";
import { BookingStep2 } from "@/components/booking/booking-step-2";
import { BookingStep3 } from "@/components/booking/booking-step-3";
import { BookingStep4 } from "@/components/booking/booking-step-4";
import { BookingReview } from "@/components/booking/booking-review";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { BookingStepIndicator } from "@/components/booking/booking-step-indicator";
import type { BookingFormData } from "@/services/booking.service";
import { createBooking } from "@/services/booking.service";
import { uploadImage } from "@/services/cloudinary.service";

import {
  photographerService,
  type Photographer,
} from "@/services/photographer.service";
import { useParams } from "next/navigation";
import BookingHeader from "@/components/booking/booking-header";
import { useRouter } from "next/navigation";

export default function BookingForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [photographer, setPhotographer] = useState<Photographer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const params = useParams();
  const [formData, setFormData] = useState<BookingFormData>({
    photographer_id: 0,
    booking_date: new Date().toISOString(),
    location_id: 0,
    custom_location: "",
    quantity: 1,
    service_id: 0,
    shooting_type: "outdoor",
    concept: "",
    illustration_url: "",
    availability_id: 0,
    discount_code: "",
    total_price: 0,
    province: "",
    photo_storage_link: "",
    payment_status: "unpaid",
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchPhotographer = async () => {
      try {
        const photographerData =
          await photographerService.getPhotographerBySlug(
            params.slug as string
          );
        setPhotographer(photographerData);
        setFormData((prev) => ({
          ...prev,
          photographer_id: photographerData.photographer_id,
        }));
      } catch (error) {
        console.error("Error fetching photographer:", error);
        toast({
          title: "Lỗi",
          description:
            "Không thể tải thông tin nhiếp ảnh gia. Vui lòng thử lại sau.",
          variant: "destructive",
        });
      }
    };
    fetchPhotographer();
  }, [params.slug, toast]);

  // console.log('Photographer data:', photographer)

  const nextStep = () => {
    if (step < 6) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const updateFormData = (data: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      console.log('Form data before submit:', formData);
      
      if (formData.illustration_url && formData.illustration_url.startsWith('data:')) {
        const response = await fetch(formData.illustration_url);
        const blob = await response.blob();
        const file = new File([blob], 'illustration.jpg', { type: 'image/jpeg' });
        
        const imageUrl = await uploadImage(file, 'photos');
        formData.illustration_url = imageUrl;
      }
      
      const response = await createBooking(formData);
      console.log('Booking response:', response);

      router.push(`/booking/success?code=${response.booking_code}`);
    
      
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast({
        title: "Đặt lịch thất bại",
        description: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
        variant: "destructive",
      });
      router.push("/booking/fail");
    } finally {
      setIsSubmitting(false);
    }
  };

  const variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="max-w-3xl mx-auto">
      <BookingHeader photographer={photographer} />
      <BookingStepIndicator currentStep={step} />

      <Card className="mt-8 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <BookingStep1
                formData={formData}
                updateFormData={updateFormData}
                nextStep={nextStep}
              />
            )}
            {step === 2 && (
              <BookingStep2
                formData={formData}
                updateFormData={updateFormData}
                nextStep={nextStep}
                prevStep={prevStep}
                photographer={photographer as Photographer}
              />
            )}
            {step === 3 && (
              <BookingStep3
                formData={formData}
                updateFormData={updateFormData}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}
            {step === 4 && (
              <BookingStep4
                formData={formData}
                updateFormData={updateFormData}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}
            {step === 5 && (
              <BookingReview
                formData={formData}
                prevStep={prevStep}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                updateFormData={updateFormData}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
}
