"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Upload, X, Save, Loader2 } from "lucide-react"
import { uploadImage } from "@/lib/supabase"
import { useDropzone } from "react-dropzone"

export default function UploadPage() {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Create preview URLs
    const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file))

    setFiles((prev) => [...prev, ...acceptedFiles])
    setPreviews((prev) => [...prev, ...newPreviews])
  }, [])

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  // Remove file
  const removeFile = (index: number) => {
    const newFiles = [...files]
    const newPreviews = [...previews]

    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviews[index])

    newFiles.splice(index, 1)
    newPreviews.splice(index, 1)

    setFiles(newFiles)
    setPreviews(newPreviews)
  }

  // Upload files
  const handleUpload = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      // Upload each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-").toLowerCase()}`

        // Upload to Supabase Storage
        await uploadImage("gallery", fileName, file)

        // Update progress
        setUploadProgress(Math.round(((i + 1) / files.length) * 100))
      }

      // Clean up previews
      previews.forEach((preview) => URL.revokeObjectURL(preview))

      // Reset state
      setFiles([])
      setPreviews([])

      // Redirect to gallery page
      router.push("/admin/gallery")
    } catch (err) {
      console.error("Error uploading files:", err)
      setError("An error occurred while uploading files. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/admin/gallery" className="inline-flex items-center text-muted-foreground hover:text-foreground">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Gallery
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Upload Images</h1>
          <p className="text-muted-foreground">Upload images to the gallery</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Images</CardTitle>
          <CardDescription>Drag and drop images or click to browse. Maximum file size: 5MB.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-pink-500 bg-pink-50"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">
              {isDragActive ? "Drop the files here..." : "Drag and drop images here, or click to select files"}
            </p>
            <p className="text-sm text-muted-foreground">Supported formats: JPEG, PNG, WebP</p>
          </div>

          {/* Error message */}
          {error && <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

          {/* Upload progress */}
          {isUploading && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Uploading... {uploadProgress}%</p>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-pink-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          )}

          {/* Preview */}
          {previews.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Selected Images ({previews.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative rounded-lg overflow-hidden aspect-square bg-muted">
                    <Image
                      src={preview || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/admin/gallery")} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            className="bg-pink-600 hover:bg-pink-700"
            onClick={handleUpload}
            disabled={files.length === 0 || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Upload {files.length > 0 ? `(${files.length})` : ""}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

