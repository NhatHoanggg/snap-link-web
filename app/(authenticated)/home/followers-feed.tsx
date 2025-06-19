"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getMyFollowers, getMyFollowing, Follower } from "@/services/follow.service"
import { Button } from "@/components/ui/button"
import { Loader2, User, Camera } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/services/auth"
import Link from "next/link"

export default function FollowersFeed() {
  const { user } = useAuth()
  const [followers, setFollowers] = useState<Follower[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFollowers = async () => {
    try {
      let data: Follower[]
      
      if (user?.role === "photographer") {
        data = await getMyFollowers()
      } else {
        data = await getMyFollowing()
      }
      
      setFollowers(data)
    } catch (err) {
      setError("Failed to load followers. Please try again later.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFollowers()
  }, [user?.role])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">
          {user?.role === "photographer" 
            ? "Đang tải người theo dõi..." 
            : "Đang tải nhiếp ảnh gia đang theo dõi..."
          }
        </span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={fetchFollowers}>Thử lại</Button>
      </div>
    )
  }

  if (followers.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="flex justify-center mb-4">
          {user?.role === "photographer" ? (
            <User className="h-16 w-16 text-muted-foreground" />
          ) : (
            <Camera className="h-16 w-16 text-muted-foreground" />
          )}
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {user?.role === "photographer" 
            ? "Chưa có người theo dõi" 
            : "Chưa theo dõi nhiếp ảnh gia nào"
          }
        </h3>
        <p className="text-muted-foreground">
          {user?.role === "photographer" 
            ? "Khi có người theo dõi, họ sẽ xuất hiện ở đây" 
            : "Bắt đầu theo dõi các nhiếp ảnh gia để xem bài viết của họ"
          }
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {followers.map((follower, index) => (
          <motion.div
            key={follower.user_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-card rounded-xl p-4 shadow-sm border"
          >
            <Link href={follower.role ? `#` : `/photographers/${follower.slug}`}>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={follower.avatar} alt={follower.full_name} />
                  <AvatarFallback>
                    {follower.full_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                    {follower.full_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Email: {follower.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Địa chỉ: {follower.province}, {follower.district}, {follower.ward}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Chi tiết: {follower.address_detail}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {follower.role === "customer" ? (
                      <>
                        <Camera className="h-3 w-3 text-primary" />
                        <span className="text-xs text-primary font-medium">Khách hàng</span>
                      </>
                    ) : (
                      <>
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Nhiếp ảnh gia</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
} 