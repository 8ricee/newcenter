"use client"

import { useEffect, useRef, useState } from "react"

interface ScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  animation?: string
}

export function useScrollAnimation({
  threshold = 0.1,
  rootMargin = "0px",
  animation = "animate-fade-up",
}: ScrollAnimationOptions = {}) {
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (ref.current) {
            ref.current.classList.add(animation)
          }
          // Unobserve after animation is triggered
          if (ref.current) observer.unobserve(ref.current)
        }
      },
      {
        threshold,
        rootMargin,
      },
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [animation, rootMargin, threshold])

  return { ref, isVisible }
}

export default useScrollAnimation

