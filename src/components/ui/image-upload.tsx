"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { uploadImage, uploadUserAvatar, uploadCourseImage } from "@/lib/actions/upload"
import { Loader2, Upload } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
    onUpload: (url: string) => void
    className?: string
    defaultImage?: string
    type?: "general" | "avatar" | "course"
    maxSize?: number
}

export function ImageUpload({ onUpload, className, defaultImage, type = "general", maxSize = 5 }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [preview, setPreview] = useState<string | null>(defaultImage || null)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Chỉ chấp nhận file hình ảnh")
            return
        }

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
            setError(`Kích thước file không được vượt quá ${maxSize}MB`)
            return
        }

        setError(null)
        setIsUploading(true)

        // Create preview
        const reader = new FileReader()
        reader.onload = () => {
            setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)

        // Upload file
        const formData = new FormData()
        formData.append("file", file)

        let result
        switch (type) {
            case "avatar":
                result = await uploadUserAvatar(formData)
                break
            case "course":
                result = await uploadCourseImage(formData)
                break
            default:
                result = await uploadImage(formData)
        }

        setIsUploading(false)

        if (result.error) {
            setError(result.error)
            return
        }

        if (result.url) {
            onUpload(result.url)
        }
    }

    const handleButtonClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className={cn("space-y-4", className)}>
            <div className="flex flex-col items-center gap-4">
                {preview ? (
                    <div className="relative overflow-hidden">
                        <Image
                            src={preview || "/placeholder.svg"}
                            alt="Preview"
                            width={type === "avatar" ? 150 : 300}
                            height={type === "avatar" ? 150 : 200}
                            className={cn(
                                "object-cover border border-border",
                                type === "avatar" ? "rounded-full w-[150px] h-[150px]" : "rounded-md w-full h-auto",
                            )}
                        />
                    </div>
                ) : (
                    <div
                        className={cn(
                            "flex items-center justify-center bg-muted border border-dashed border-border",
                            type === "avatar" ? "rounded-full w-[150px] h-[150px]" : "rounded-md w-full h-[200px]",
                        )}
                    >
                        <Upload className="w-8 h-8 text-muted-foreground" />
                    </div>
                )}

                <div className="flex flex-col items-center gap-2">
                    <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    <Button type="button" variant="outline" onClick={handleButtonClick} disabled={isUploading}>
                        {isUploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang tải lên...
                            </>
                        ) : preview ? (
                            "Thay đổi ảnh"
                        ) : (
                            "Tải ảnh lên"
                        )}
                    </Button>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
            </div>
        </div>
    )
}

