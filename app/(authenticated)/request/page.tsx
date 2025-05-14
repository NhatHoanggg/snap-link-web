"use client";

import { useState } from "react";
import { format } from "date-fns";
import { DateSelection } from "@/components/request/date-selection";
import { RequestForm } from "@/components/request/request-form";
import { Card } from "@/components/ui/card";
import { CreateRequest } from "@/services/request.service";
import { createRequest } from "@/services/request.service";
// import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RequestPage() {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // const router = useRouter();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleNextStep = () => {
    setStep(2);
  };

  const handleSubmit = async (formData: Omit<CreateRequest, "request_date">) => {
    try {
      if (!selectedDate) return;

      const requestData: CreateRequest = {
        ...formData,
        request_date: format(selectedDate, "yyyy-MM-dd"),
      };

      await createRequest(requestData);
      // toast.success("Yêu cầu đã được gửi thành công!");
      // router.push("/request");
    } catch (error) {
      console.error("Error creating request:", error);
      toast.error("Không thể gửi yêu cầu. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        {step === 1 ? (
          <DateSelection
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            nextStep={handleNextStep}
          />
        ) : (
          <RequestForm
            selectedDate={selectedDate}
            onSubmit={handleSubmit}
            onBack={() => setStep(1)}
          />
        )}
      </Card>
    </div>
  );
}