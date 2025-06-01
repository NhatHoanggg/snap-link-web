"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cài đặt</h1>
      </div>

      <div className="grid gap-6">
        <Button
          variant="outline"
          className="flex flex-col items-start gap-1 w-full p-6 h-auto text-left border rounded-md"
          onClick={() => router.push("/profile/edit")}
        >
          <h2 className="text-lg font-medium">Thông tin tài khoản</h2>
          <p className="text-sm text-muted-foreground">
            Cập nhật thông tin tài khoản của bạn
          </p>
        </Button>

        <Button
          variant="outline"
          className="flex flex-col items-start gap-1 w-full p-6 h-auto text-left border rounded-md"
          onClick={() => router.push("/settings/guide")}
        >
          <h2 className="text-lg font-medium">Hướng dẫn sử dụng</h2>
          <p className="text-sm text-muted-foreground">
            Hướng dẫn sử dụng ứng dụng
          </p>
        </Button>

        <Button
          variant="outline"
          className="flex flex-col items-start gap-1 w-full p-6 h-auto text-left border rounded-md"
          onClick={() => router.push("/settings/password")}
        >
          <h2 className="text-lg font-medium">Đổi mật khẩu</h2>
          <p className="text-sm text-muted-foreground">
            Đổi mật khẩu để bảo mật tài khoản của bạn
          </p>
        </Button>

        <Button
          variant="outline"
          className="flex flex-col items-start gap-1 w-full p-6 h-auto text-left border rounded-md"
          onClick={() => router.push("/settings/appearance")}
        >
          <h2 className="text-lg font-medium">Giao diện</h2>
          <p className="text-sm text-muted-foreground">
            Tùy chọn giao diện của ứng dụng
          </p>
        </Button>
      </div>
    </div>
  );
}
