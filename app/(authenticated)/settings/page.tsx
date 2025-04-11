"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="grid gap-6">
        <Button
          variant="outline"
          className="flex flex-col items-start gap-1 w-full p-6 h-auto text-left border rounded-md"
          onClick={() => router.push("/settings/general")}
        >
          <h2 className="text-lg font-medium">General Settings</h2>
          <p className="text-sm text-muted-foreground">
            Configure your general application settings
          </p>
        </Button>

        <Button
          variant="outline"
          className="flex flex-col items-start gap-1 w-full p-6 h-auto text-left border rounded-md"
          onClick={() => router.push("/settings/password")}
        >
          <h2 className="text-lg font-medium">Change Your Password</h2>
          <p className="text-sm text-muted-foreground">
            Change your password to keep your account secure
          </p>
        </Button>

        <Button
          variant="outline"
          className="flex flex-col items-start gap-1 w-full p-6 h-auto text-left border rounded-md"
          onClick={() => router.push("/settings/appearance")}
        >
          <h2 className="text-lg font-medium">Appearance</h2>
          <p className="text-sm text-muted-foreground">
            Customize the look and feel of your application
          </p>
        </Button>

        <Button
          variant="outline"
          className="flex flex-col items-start gap-1 w-full p-6 h-auto text-left border rounded-md"
          onClick={() => router.push("/settings/notifications")}
        >
          <h2 className="text-lg font-medium">Notifications</h2>
          <p className="text-sm text-muted-foreground">
            Manage your notification preferences
          </p>
        </Button>
      </div>
    </div>
  );
}
