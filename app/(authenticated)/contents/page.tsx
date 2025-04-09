export default function ContentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Contents</h1>
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Add New Content
        </button>
      </div>
      <div className="rounded-md border">
        <div className="p-4">
          {/* Add your content list/table here */}
          <p className="text-sm text-muted-foreground">
            No contents found. Create your first content to get started.
          </p>
        </div>
      </div>
    </div>
  );
} 