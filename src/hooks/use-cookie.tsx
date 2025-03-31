"use client"

import { useEffect, useState } from "react"

export function getCookie(name: string): string | undefined {
    if (typeof document === "undefined") return undefined

    const cookies = document.cookie.split("; ")
    const cookie = cookies.find((c) => c.startsWith(`${name}=`))
    return cookie ? cookie.split("=")[1] : undefined
}

export function useCookie(name: string): [string | undefined, (value: string, options?: { maxAge?: number }) => void] {
    const [value, setValue] = useState<string | undefined>()

    useEffect(() => {
        setValue(getCookie(name))
    }, [name])

    const setCookie = (newValue: string, options?: { maxAge?: number }) => {
        const maxAge = options?.maxAge || 60 * 60 * 24 * 7 // 1 week default
        document.cookie = `${name}=${newValue}; path=/; max-age=${maxAge}`
        setValue(newValue)
    }

    return [value, setCookie]
}

