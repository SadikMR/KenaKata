"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Camera, X, Loader2 } from "lucide-react"
import { API_BASE_URL } from "@/lib/api/client"

interface AvatarUploadProps {
  avatarUrl: string
  onAvatarChange: (url: string) => void
}

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=User&background=d4c5a9&color=1a1816&size=200"

export function AvatarUpload({ avatarUrl, onAvatarChange }: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const displayUrl = preview || avatarUrl || DEFAULT_AVATAR

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file)
    setPreview(localPreview)

    // Upload to API
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${API_BASE_URL}/files/upload`, {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        onAvatarChange(data.location)
      } else {
        // Upload failed — keep the local preview as a data URL fallback
        const reader = new FileReader()
        reader.onload = () => {
          onAvatarChange(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    } catch {
      // Network error — use data URL fallback
      const reader = new FileReader()
      reader.onload = () => {
        onAvatarChange(reader.result as string)
      }
      reader.readAsDataURL(file)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onAvatarChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group">
        {/* Avatar preview */}
        <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-border bg-muted">
          <Image
            src={displayUrl}
            alt="Avatar preview"
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Upload overlay */}
        {isUploading ? (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/70">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center rounded-full bg-background/0 group-hover:bg-background/60 transition-colors cursor-pointer"
          >
            <Camera className="h-6 w-6 text-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}

        {/* Remove button */}
        {(preview || avatarUrl) && !isUploading && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/80 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-muted-foreground">
        Click to upload avatar (optional)
      </p>
    </div>
  )
}
