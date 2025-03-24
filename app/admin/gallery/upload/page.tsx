"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Upload, X, Loader2, ImagePlus } from "lucide-react"

export default function UploadGalleryImages() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [category, setCategory] = useState("")
  const [cosplayer, setCosplayer] = useState("")

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles = Array.from(files)
    setSelectedFiles([...selectedFiles, ...newFiles])

    // Generate preview URLs
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file))
    setPreviewImages([...previewImages, ...newPreviews])
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    if (!files || files.length === 0) return

    const newFiles = Array.from(files).filter((file) => file.type.startsWith("image/"))
    setSelectedFiles([...selectedFiles, ...newFiles])

    // Generate preview URLs
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file))
    setPreviewImages([...previewImages, ...newPreviews])
  }

  // Remove file
  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles]
    const newPreviews = [...previewImages]

    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviews[index])

    newFiles.splice(index, 1)
    newPreviews.splice(index, 1)

    setSelectedFiles(newFiles)
    setPreviewImages(newPreviews)
  }

  // Handle upload
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200))
        setUploadProgress(i)
      }

      // In a real app, you would upload the files to your server/cloud storage
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Clean up preview URLs
      previewImages.forEach((url) => URL.revokeObjectURL(url))

      // Redirect to gallery page
      router.push("/admin/gallery")
    } catch (error) {
      console.error("Error uploading files:", error)
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
          <p className="text-muted-foreground">Add new images to the gallery</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload Images</CardTitle>
              <CardDescription>Drag and drop images or click to browse</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <Input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                />
                <ImagePlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Drag images here or click to browse</h3>
                <p className="text-sm text-muted-foreground mb-4">Supported formats: JPEG, PNG, GIF, WebP</p>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Select Files
                </Button>
              </div>

              {selectedFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Selected Images ({selectedFiles.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="relative rounded-lg overflow-hidden aspect-square bg-muted">
                        <Image
                          src={preview || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                          <p className="text-white text-xs truncate">{selectedFiles[index].name}</p>
                          <p className="text-white/80 text-xs">
                            {(selectedFiles[index].size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isUploading && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Uploading...</Label>
                    <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  // Clean up preview URLs
                  previewImages.forEach((url) => URL.revokeObjectURL(url))
                  setSelectedFiles([])
                  setPreviewImages([])
                }}
                disabled={selectedFiles.length === 0 || isUploading}
              >
                Clear All
              </Button>
              <Button
                className="bg-pink-600 hover:bg-pink-700"
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload {selectedFiles.length} {selectedFiles.length === 1 ? "Image" : "Images"}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Image Details</CardTitle>
              <CardDescription>Add common details for all images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="demon-slayer">Demon Slayer</SelectItem>
                    <SelectItem value="my-hero-academia">My Hero Academia</SelectItem>
                    <SelectItem value="attack-on-titan">Attack on Titan</SelectItem>
                    <SelectItem value="one-piece">One Piece</SelectItem>
                    <SelectItem value="naruto">Naruto</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cosplayer">Cosplayer</Label>
                <Select value={cosplayer} onValueChange={setCosplayer}>
                  <SelectTrigger id="cosplayer">
                    <SelectValue placeholder="Select cosplayer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Sakura Cosplay</SelectItem>
                    <SelectItem value="2">Hiroshi Designs</SelectItem>
                    <SelectItem value="3">Anime Artisan</SelectItem>
                    <SelectItem value="4">Cosplay King</SelectItem>
                    <SelectItem value="5">Fantasy Forge</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="character">Character</Label>
                <Input id="character" placeholder="Enter character name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Enter description" />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input type="checkbox" id="featured" className="rounded text-pink-600" />
                <Label htmlFor="featured">Feature these images on the homepage</Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

