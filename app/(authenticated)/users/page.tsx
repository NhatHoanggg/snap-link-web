export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Add User
        </button>
      </div>
      <div className="rounded-md border">
        <div className="p-4">
          {/* Add your users list/table here */}
          <p className="text-sm text-muted-foreground">
            No users found. Add your first user to get started.
          </p>
        </div>
      </div>
    </div>
  );
} 