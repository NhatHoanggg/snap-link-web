export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      <div className="grid gap-6">
        <div className="rounded-md border p-6">
          <h2 className="text-lg font-medium">General Settings</h2>
          <p className="text-sm text-muted-foreground">
            Configure your general application settings
          </p>
        </div>
        <div className="rounded-md border p-6">
          <h2 className="text-lg font-medium">Appearance</h2>
          <p className="text-sm text-muted-foreground">
            Customize the look and feel of your application
          </p>
        </div>
        <div className="rounded-md border p-6">
          <h2 className="text-lg font-medium">Notifications</h2>
          <p className="text-sm text-muted-foreground">
            Manage your notification preferences
          </p>
        </div>
      </div>
    </div>
  );
} 