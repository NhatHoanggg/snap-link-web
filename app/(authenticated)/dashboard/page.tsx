export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Add your dashboard cards/stats here */}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          {/* Add your main content here */}
        </div>
        <div className="col-span-3">
          {/* Add your sidebar content here */}
        </div>
      </div>
    </div>
  );
} 