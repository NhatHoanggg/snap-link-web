"use client"

// import { useState } from "react"
import Link from "next/link"
import {
  Bell,
  BookmarkIcon,
  CircleEllipsis,
  Home,
  Image,
  ListFilter,
  Mail,
  MessageCircle,
  MoreHorizontal,
  RefreshCw,
  Repeat2,
  Search,
  Settings,
  Sparkles,
  Star,
  User,
  Users,
  X,
  Zap,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HomePage() {
//   const [activeTab, setActiveTab] = useState("for-you")

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Left Sidebar */}
      <div className="fixed left-0 top-0 flex h-full w-[275px] flex-col border-r border-zinc-800 p-4">
        <div className="mb-4 px-3">
          <X className="h-7 w-7" />
        </div>

        <nav className="mb-4 space-y-1">
          <Link
            href="/home"
            className="flex items-center gap-4 rounded-full px-3 py-3 text-xl font-bold hover:bg-zinc-900"
          >
            <Home className="h-7 w-7" />
            <span>Home</span>
          </Link>
          <Link
            href="/explore"
            className="flex items-center gap-4 rounded-full px-3 py-3 text-xl font-normal text-zinc-200 hover:bg-zinc-900"
          >
            <Search className="h-7 w-7" />
            <span>Explore</span>
          </Link>
          <Link
            href="/notifications"
            className="flex items-center gap-4 rounded-full px-3 py-3 text-xl font-normal text-zinc-200 hover:bg-zinc-900"
          >
            <Bell className="h-7 w-7" />
            <span>Notifications</span>
          </Link>
          <Link
            href="/messages"
            className="flex items-center gap-4 rounded-full px-3 py-3 text-xl font-normal text-zinc-200 hover:bg-zinc-900"
          >
            <Mail className="h-7 w-7" />
            <span>Messages</span>
          </Link>
          <Link
            href="/grok"
            className="flex items-center gap-4 rounded-full px-3 py-3 text-xl font-normal text-zinc-200 hover:bg-zinc-900"
          >
            <Zap className="h-7 w-7" />
            <span>Grok</span>
          </Link>
          <Link
            href="/communities"
            className="flex items-center gap-4 rounded-full px-3 py-3 text-xl font-normal text-zinc-200 hover:bg-zinc-900"
          >
            <Users className="h-7 w-7" />
            <span>Communities</span>
          </Link>
          <Link
            href="/premium"
            className="flex items-center gap-4 rounded-full px-3 py-3 text-xl font-normal text-zinc-200 hover:bg-zinc-900"
          >
            <Star className="h-7 w-7" />
            <span>Premium</span>
          </Link>
          <Link
            href="/profile"
            className="flex items-center gap-4 rounded-full px-3 py-3 text-xl font-normal text-zinc-200 hover:bg-zinc-900"
          >
            <User className="h-7 w-7" />
            <span>Profile</span>
          </Link>
          <button className="flex w-full items-center gap-4 rounded-full px-3 py-3 text-xl font-normal text-zinc-200 hover:bg-zinc-900">
            <CircleEllipsis className="h-7 w-7" />
            <span>More</span>
          </button>
        </nav>

        <Button className="mt-4 w-full rounded-full bg-[#1d9bf0] py-6 text-lg font-bold hover:bg-[#1a8cd8]">
          Post
        </Button>

        <div className="mt-auto flex items-center gap-2 rounded-full p-3 hover:bg-zinc-900">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="@username" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">
            <p className="font-bold">Username</p>
            <p className="truncate text-sm text-zinc-500">@username</p>
          </div>
          <MoreHorizontal className="h-5 w-5 text-zinc-500" />
        </div>
      </div>

      {/* Main Content */}
      <main className="ml-[275px] flex-1 border-r border-zinc-800">
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
            <h1 className="text-xl font-bold">Home</h1>
            <Sparkles className="h-5 w-5" />
          </div>

          <Tabs defaultValue="for-you" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-transparent p-0">
              <TabsTrigger
                value="for-you"
                className="rounded-none border-b-2 border-transparent py-4 data-[state=active]:border-[#1d9bf0] data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                // onClick={() => setActiveTab("for-you")}
              >
                For you
              </TabsTrigger>
              <TabsTrigger
                value="following"
                className="rounded-none border-b-2 border-transparent py-4 data-[state=active]:border-[#1d9bf0] data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                // onClick={() => setActiveTab("following")}
              >
                Following
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Post composer */}
        <div className="border-b border-zinc-800 p-4">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="@username" />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="mb-4">
                <Input
                  className="border-none bg-transparent text-xl placeholder:text-zinc-500 focus-visible:ring-0"
                  placeholder="What's happening?"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#1d9bf0]">
                  <button className="rounded-full p-2 hover:bg-[#1d9bf0]/10">
                    <Image className="h-5 w-5" />
                  </button>
                  <button className="rounded-full p-2 hover:bg-[#1d9bf0]/10">
                    <ListFilter className="h-5 w-5" />
                  </button>
                  <button className="rounded-full p-2 hover:bg-[#1d9bf0]/10">
                    <Sparkles className="h-5 w-5" />
                  </button>
                  <button className="rounded-full p-2 hover:bg-[#1d9bf0]/10">
                    <Settings className="h-5 w-5" />
                  </button>
                  <button className="rounded-full p-2 hover:bg-[#1d9bf0]/10">
                    <BookmarkIcon className="h-5 w-5" />
                  </button>
                </div>
                <Button className="rounded-full bg-[#1d9bf0] px-4 font-bold hover:bg-[#1a8cd8]" size="sm">
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Feed */}
        <div>
          {/* Sample posts */}
          {[1, 2, 3].map((post) => (
            <div key={post} className="border-b border-zinc-800 p-4">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${post}`} alt="User" />
                  <AvatarFallback>U{post}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <span className="font-bold">User Name</span>
                    <span className="text-zinc-500">@username · 2h</span>
                    <div className="ml-auto">
                      <button>
                        <MoreHorizontal className="h-5 w-5 text-zinc-500" />
                      </button>
                    </div>
                  </div>
                  <p className="mb-3 mt-1">
                    This is a sample post content. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    {post === 1 && " Can you solve it? Correct answer wins $8000"}
                  </p>
                  {post === 1 && (
                    <div className="mb-3 overflow-hidden rounded-2xl border border-zinc-800">
                      <img
                        src="/placeholder.svg?height=400&width=600&text=Puzzle+Image"
                        alt="Puzzle"
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between text-zinc-500">
                    <button className="flex items-center gap-1 rounded-full p-2 hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0]">
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-xs">{post * 11}</span>
                    </button>
                    <button className="flex items-center gap-1 rounded-full p-2 hover:bg-green-500/10 hover:text-green-500">
                      <Repeat2 className="h-5 w-5" />
                      <span className="text-xs">{post * 5}</span>
                    </button>
                    <button className="flex items-center gap-1 rounded-full p-2 hover:bg-red-500/10 hover:text-red-500">
                      <Star className="h-5 w-5" />
                      <span className="text-xs">{post * 21}</span>
                    </button>
                    <button className="flex items-center gap-1 rounded-full p-2 hover:bg-[#1d9bf0]/10 hover:text-[#1d9bf0]">
                      <RefreshCw className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Right Sidebar */}
      <div className="ml-[75px] w-[350px] p-4">
        {/* Search */}
        <div className="sticky top-0 z-10 mb-4 bg-black pt-2">
          <div className="relative rounded-full bg-zinc-900">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <Input
              className="rounded-full border-none bg-transparent pl-10 placeholder:text-zinc-500 focus-visible:ring-0"
              placeholder="Search"
            />
          </div>
        </div>

        {/* Premium */}
        <div className="mb-4 rounded-xl bg-zinc-900 p-4">
          <h2 className="mb-2 text-xl font-bold">Subscribe to Premium</h2>
          <p className="mb-3 text-sm">Subscribe to unlock new features and if eligible, receive a share of revenue.</p>
          <Button className="rounded-full bg-[#1d9bf0] font-bold hover:bg-[#1a8cd8]">Subscribe</Button>
        </div>

        {/* What's happening */}
        <div className="mb-4 rounded-xl bg-zinc-900">
          <h2 className="p-4 text-xl font-bold">Whats happening</h2>

          <div className="cursor-pointer border-b border-zinc-800 px-4 py-3 hover:bg-zinc-800/50">
            <div className="flex justify-between">
              <div>
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <span>Only on X · Trending</span>
                </div>
                <p className="font-bold">From the Desk of Anthony Pompliano</p>
                <p className="text-xs text-zinc-500">LIVE</p>
              </div>
              <div>
                <Avatar className="h-10 w-10 rounded-md">
                  <AvatarImage src="/placeholder.svg?height=40&width=40&text=AP" alt="Anthony Pompliano" />
                  <AvatarFallback>AP</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>

          <div className="cursor-pointer border-b border-zinc-800 px-4 py-3 hover:bg-zinc-800/50">
            <div className="flex justify-between">
              <div>
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <span>Trending</span>
                </div>
                <p className="font-bold">#riyadh</p>
                <p className="text-xs text-zinc-500">472K posts</p>
              </div>
              <button>
                <MoreHorizontal className="h-5 w-5 text-zinc-500" />
              </button>
            </div>
          </div>

          <div className="cursor-pointer border-b border-zinc-800 px-4 py-3 hover:bg-zinc-800/50">
            <div className="flex justify-between">
              <div>
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <span>Business & finance · Trending</span>
                </div>
                <p className="font-bold">Black Monday</p>
                <p className="text-xs text-zinc-500">25.6K posts</p>
              </div>
              <button>
                <MoreHorizontal className="h-5 w-5 text-zinc-500" />
              </button>
            </div>
          </div>

          <div className="cursor-pointer border-b border-zinc-800 px-4 py-3 hover:bg-zinc-800/50">
            <div className="flex justify-between">
              <div>
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <span>Politics · Trending</span>
                </div>
                <p className="font-bold">Kamala</p>
                <p className="text-xs text-zinc-500">123K posts</p>
              </div>
              <button>
                <MoreHorizontal className="h-5 w-5 text-zinc-500" />
              </button>
            </div>
          </div>

          <div className="cursor-pointer px-4 py-3 hover:bg-zinc-800/50">
            <div className="flex justify-between">
              <div>
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <span>Trending in Vietnam</span>
                </div>
                <p className="font-bold">#1stFanmeetENGLOTinTAIPEI</p>
                <p className="text-xs text-zinc-500">414K posts</p>
              </div>
              <button>
                <MoreHorizontal className="h-5 w-5 text-zinc-500" />
              </button>
            </div>
          </div>

          <div className="p-4">
            <Button variant="ghost" className="text-[#1d9bf0]">
              Show more
            </Button>
          </div>
        </div>

        {/* Who to follow */}
        <div className="rounded-xl bg-zinc-900">
          <h2 className="p-4 text-xl font-bold">Who to follow</h2>

          {[1, 2, 3].map((user) => (
            <div
              key={user}
              className="flex items-center justify-between border-b border-zinc-800 px-4 py-3 last:border-0 hover:bg-zinc-800/50"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`/placeholder.svg?height=40&width=40&text=U${user}`} alt={`User ${user}`} />
                  <AvatarFallback>U{user}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold">User Name {user}</p>
                  <p className="text-sm text-zinc-500">@username{user}</p>
                </div>
              </div>
              <Button className="rounded-full bg-white text-black hover:bg-zinc-200" size="sm">
                Follow
              </Button>
            </div>
          ))}

          <div className="p-4">
            <Button variant="ghost" className="text-[#1d9bf0]">
              Show more
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex flex-wrap gap-x-2 gap-y-1 text-xs text-zinc-500">
          <Link href="#" className="hover:underline">
            Terms of Service
          </Link>
          <Link href="#" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:underline">
            Cookie Policy
          </Link>
          <Link href="#" className="hover:underline">
            Accessibility
          </Link>
          <Link href="#" className="hover:underline">
            Ads info
          </Link>
          <Link href="#" className="hover:underline">
            More
          </Link>
          <span>© 2025 X Corp.</span>
        </div>
      </div>

      {/* Mobile Post Button */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <Button className="h-14 w-14 rounded-full bg-[#1d9bf0] p-0 shadow-lg hover:bg-[#1a8cd8]">
          <span className="sr-only">Post</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-white">
            <g>
              <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z"></path>
            </g>
          </svg>
        </Button>
      </div>
    </div>
  )
}

