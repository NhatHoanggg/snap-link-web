"use client"

import { useAuth } from "@/lib/auth"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  Home, 
  Search, 
  Bell, 
  Mail, 
  User, 
  LogOut,
  Hash,
  Users,
  BookmarkIcon,
  Settings,
  MoreHorizontal,
  ImageIcon,
  Camera,
  Smile
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function HomePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token")
      const userData = localStorage.getItem("user")
      return !!(token && userData)
    }

    if (!isLoading) {
      if (!checkAuth()) {
        router.push("/login")
      } else {
        setIsChecking(false)
      }
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-12 gap-4">
          {/* Left Sidebar */}
          <aside className="col-span-3 xl:col-span-2">
            <div className="sticky top-0 h-screen flex flex-col py-4">
              <div className="px-4">
                <div className="text-2xl font-bold text-primary mb-8">SnapLink</div>
                
                <nav className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start text-lg">
                    <Home className="mr-4 h-5 w-5" /> Home
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-lg">
                    <Search className="mr-4 h-5 w-5" /> Explore
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-lg">
                    <Bell className="mr-4 h-5 w-5" /> Notifications
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-lg">
                    <Mail className="mr-4 h-5 w-5" /> Messages
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-lg">
                    <BookmarkIcon className="mr-4 h-5 w-5" /> Bookmarks
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-lg">
                    <User className="mr-4 h-5 w-5" /> Profile
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-lg">
                    <Settings className="mr-4 h-5 w-5" /> Settings
                  </Button>
                </nav>

                <Button className="w-full mt-6 text-lg py-6">Post</Button>
              </div>

              <div className="mt-auto px-4">
                <div className="flex items-center gap-3 p-3 rounded-full hover:bg-muted/50 transition-colors cursor-pointer">
                  <Avatar>
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.full_name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold leading-tight truncate">{user?.full_name || "User Name"}</p>
                    <p className="text-sm text-muted-foreground truncate">@{user?.email?.split('@')[0] || "username"}</p>
                  </div>
                  <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                </div>

                <Button 
                  variant="outline" 
                  onClick={() => logout()}
                  className="w-full flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="col-span-6 xl:col-span-7 border-x border-border">
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border p-4">
              <h1 className="text-xl font-bold">Home</h1>
            </div>

            {/* Post Creation */}
            <div className="p-4 border-b border-border">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.full_name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <textarea 
                    placeholder="What's happening?"
                    className="w-full bg-transparent border-none focus:outline-none resize-none text-lg"
                    rows={3}
                  />
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="text-primary hover:text-primary">
                        <ImageIcon className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-primary hover:text-primary">
                        <Camera className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-primary hover:text-primary">
                        <Smile className="h-5 w-5" />
                      </Button>
                    </div>
                    <Button className="px-6">Post</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="divide-y divide-border">
              {[1, 2, 3, 4, 5].map((post) => (
                <div key={post} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarImage src={`https://i.pravatar.cc/100?img=${post + 2}`} />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{post % 2 === 0 ? "Jane Smith" : "John Doe"}</span>
                        <span className="text-muted-foreground">@{post % 2 === 0 ? "janesmith" : "johndoe"}</span>
                        <span className="text-muted-foreground">• {post}h</span>
                      </div>
                      <p className="mt-2 text-lg">
                        {post % 3 === 0 
                          ? "Just launched a new project! Check it out and let me know what you think. #webdev #coding" 
                          : post % 2 === 0 
                            ? "Excited to share my latest work. Been working on this for weeks and finally ready to show it off!"
                            : "This is a sample post. You can replace it with dynamic content from your backend."}
                      </p>
                      {post % 4 === 0 && (
                        <div className="mt-3 rounded-xl overflow-hidden border border-border">
                          <img 
                            src={`https://picsum.photos/seed/${post}/600/400`} 
                            alt="Post image" 
                            className="w-full h-auto object-cover"
                          />
                        </div>
                      )}
                      <div className="flex gap-8 mt-4 text-muted-foreground">
                        <button className="flex items-center gap-1 hover:text-primary">
                          <Mail className="h-5 w-5" /> {post * 3}
                        </button>
                        <button className="flex items-center gap-1 hover:text-green-500">
                          <Hash className="h-5 w-5" /> {post * 2}
                        </button>
                        <button className="flex items-center gap-1 hover:text-red-500">
                          <Users className="h-5 w-5" /> {post * 10}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>          
        </div>
      </div>
    </div>
  )
}
