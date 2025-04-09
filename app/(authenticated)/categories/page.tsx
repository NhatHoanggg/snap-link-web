export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Add Category
        </button>
      </div>
      <div className="rounded-md border">
        <div className="p-4">
          {/* Add your categories list/table here */}
          <p className="text-sm text-muted-foreground">
            No categories found. Create your first category to get started.
          </p>
        </div>
      </div>
    </div>
  );
} 