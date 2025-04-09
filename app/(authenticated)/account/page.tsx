export default function AccountPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Account</h1>
      </div>
      <div className="grid gap-6">
        <div className="rounded-md border p-6">
          <h2 className="text-lg font-medium">Profile Information</h2>
          <p className="text-sm text-muted-foreground">
            Update your profile information and personal details
          </p>
        </div>
        <div className="rounded-md border p-6">
          <h2 className="text-lg font-medium">Security</h2>
          <p className="text-sm text-muted-foreground">
            Manage your password and security settings
          </p>
        </div>
        <div className="rounded-md border p-6">
          <h2 className="text-lg font-medium">Preferences</h2>
          <p className="text-sm text-muted-foreground">
            Configure your account preferences
          </p>
        </div>
      </div>
    </div>
  );
} 