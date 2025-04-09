export default function PostsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Posts</h1>
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Create Post
        </button>
      </div>
      <div className="rounded-md border">
        <div className="p-4">
          {/* Add your posts list/table here */}
          <p className="text-sm text-muted-foreground">
            No posts found. Create your first post to get started.
          </p>
        </div>
      </div>
    </div>
  );
} 