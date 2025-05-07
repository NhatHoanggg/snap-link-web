"use client"

import { useEffect, useState } from "react"
import Confetti from "react-confetti"
import { useWindowSize } from "@/hooks/use-window-size"

export function ConfettiEffect() {
  const { width, height } = useWindowSize()
  const [pieces, setPieces] = useState(200)

  useEffect(() => {
    // Giảm dần số lượng confetti sau 2 giây
    const timer = setTimeout(() => {
      setPieces(50)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={pieces}
      recycle={false}
      colors={["#22c55e", "#3b82f6", "#f97316", "#8b5cf6", "#ec4899"]}
      gravity={0.2}
    />
  )
}
