"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function GuidePage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Hướng dẫn sử dụng</h1>
      </div>

      <div className="grid gap-6">
        <Button
          variant="outline"
          className="flex flex-col items-start gap-1 w-full p-6 h-auto text-left border rounded-md"
          onClick={() => router.push("/settings/guide/booking")}
        >
          <h2 className="text-lg font-medium">Đặt lịch hẹn</h2>
          <p className="text-sm text-muted-foreground">
            Hướng dẫn đặt lịch hẹn
          </p>
        </Button>

        <Button
          variant="outline"
          className="flex flex-col items-start gap-1 w-full p-6 h-auto text-left border rounded-md"
          onClick={() => router.push("/settings/guide/request")}
        >
          <h2 className="text-lg font-medium">Yêu cầu đặt lịch hẹn</h2>
          <p className="text-sm text-muted-foreground">
            Hướng dẫn tạo yêu cầu đặt lịch hẹn
          </p>
        </Button>

      </div>
    </div>
  );
}
