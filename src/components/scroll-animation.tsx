"use client"

import type React from "react"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface ScrollAnimationProps {
  children: ReactNode
  animation?:
  | "animate-fade-up"
  | "animate-fade-down"
  | "animate-fade-in"
  | "animate-slide-in-right"
  | "animate-slide-in-left"
  | "animate-zoom-in"
  className?: string
  threshold?: number
  rootMargin?: string
  delay?:
  | "animate-delay-100"
  | "animate-delay-200"
  | "animate-delay-300"
  | "animate-delay-400"
  | "animate-delay-500"
  | "animate-delay-700"
  | "animate-delay-1000"
  duration?: "animate-duration-300" | "animate-duration-500" | "animate-duration-700" | "animate-duration-1000"
}

export function ScrollAnimation({
  children,
  animation = "animate-fade-up",
  className,
  threshold = 0.1,
  rootMargin = "0px",
  delay,
  duration,
}: ScrollAnimationProps) {
  const { ref, isVisible } = useScrollAnimation({
    threshold,
    rootMargin,
    animation,
  })

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn("scroll-animation opacity-0", isVisible && "animate", delay, duration, className)}
    >
      {children}
    </div>
  )
}

export default ScrollAnimation

