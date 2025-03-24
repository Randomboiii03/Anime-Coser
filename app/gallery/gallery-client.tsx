"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Heart, MessageCircle, Share2, X, ChevronLeft, ChevronRight } from "lucide-react"
import type { GalleryItem } from "@/lib/api/gallery"

export default function GalleryClient({ initialGalleryItems }: { initialGalleryItems: GalleryItem[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialGalleryItems)
  const [filteredGallery, setFilteredGallery] = useState<GalleryItem[]>(initialGalleryItems)
  const [currentPage, setCurrentPage] = useState(1)
  const [likedItems, setLikedItems] = useState<number[]>([])
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)
  const [fullscreenIndex, setFullscreenIndex] = useState(0)

  const itemsPerPage = 12

  // Filter and sort gallery items
  useEffect(() => {
    let result = [...galleryItems]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.cosplayerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter((item) => item.tags.some((tag) => tag.toLowerCase() === categoryFilter.toLowerCase()))
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "popular":
        result.sort((a, b) => b.likes - a.likes)
        break
      case "title-asc":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "title-desc":
        result.sort((a, b) => b.title.localeCompare(a.title))
        break
    }

    setFilteredGallery(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchTerm, categoryFilter, sortBy, galleryItems])

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredGallery.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredGallery.length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleLike = async (id: number) => {
    if (likedItems.includes(id)) {
      setLikedItems(likedItems.filter((itemId) => itemId !== id))
    } else {
      setLikedItems([...likedItems, id])

      // Call API to increment likes
      try {
        await fetch("/api/likes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ galleryItemId: id }),
        })
      } catch (error) {
        console.error("Error incrementing likes:", error)
      }
    }
  }

  const openFullscreen = (item: GalleryItem) => {
    setSelectedImage(item)
    setFullscreenIndex(filteredGallery.findIndex((i) => i.id === item.id))
  }

  const closeFullscreen = () => {
    setSelectedImage(null)
  }

  const navigateFullscreen = (direction: "next" | "prev") => {
    let newIndex = direction === "next" ? fullscreenIndex + 1 : fullscreenIndex - 1

    // Handle wrapping around
    if (newIndex < 0) {
      newIndex = filteredGallery.length - 1
    } else if (newIndex >= filteredGallery.length) {
      newIndex = 0
    }

    setFullscreenIndex(newIndex)
    setSelectedImage(filteredGallery[newIndex])
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Cosplay Gallery</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Browse our collection of stunning cosplay photos from talented creators around the world.
        </p>
      </div>

      {/* Search and Categories */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-grow">
          <Input placeholder="Search gallery..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex-shrink-0">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="demon slayer">Demon Slayer</SelectItem>
              <SelectItem value="my hero academia">My Hero Academia</SelectItem>
              <SelectItem value="attack on titan">Attack on Titan</SelectItem>
              <SelectItem value="one piece">One Piece</SelectItem>
              <SelectItem value="naruto">Naruto</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-shrink-0">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Gallery Tabs */}
      <Tabs defaultValue="grid" className="mb-8">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="masonry">Masonry View</TabsTrigger>
          </TabsList>
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredGallery.length)} of{" "}
            {filteredGallery.length} photos
          </div>
        </div>

        {/* Grid View */}
        <TabsContent value="grid" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-lg cursor-pointer"
                onClick={() => openFullscreen(item)}
              >
                <Image
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.title}
                  width={300}
                  height={400}
                  className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold">{item.title}</h3>
                  <p className="text-white/80 text-sm">{item.cosplayerName}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {item.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="outline" className="border-white/30 text-white">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLike(item.id)
                      }}
                    >
                      <Heart className={`h-5 w-5 ${likedItems.includes(item.id) ? "fill-pink-600" : ""}`} />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white">
                      <MessageCircle className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Masonry View */}
        <TabsContent value="masonry" className="mt-6">
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {currentItems.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-lg break-inside-avoid cursor-pointer"
                onClick={() => openFullscreen(item)}
              >
                <Image
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.title}
                  width={300}
                  height={item.id % 2 === 0 ? 400 : 300}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold">{item.title}</h3>
                  <p className="text-white/80 text-sm">{item.cosplayerName}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {item.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="outline" className="border-white/30 text-white">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLike(item.id)
                      }}
                    >
                      <Heart className={`h-5 w-5 ${likedItems.includes(item.id) ? "fill-pink-600" : ""}`} />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white">
                      <MessageCircle className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant="outline"
                className={currentPage === page ? "bg-pink-600 text-white hover:bg-pink-700" : ""}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Fullscreen Image Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && closeFullscreen()}>
        <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 overflow-hidden">
          <div className="relative h-full flex flex-col">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-50 text-white bg-black/50 hover:bg-black/70 rounded-full"
              onClick={closeFullscreen}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Navigation buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-50 text-white bg-black/50 hover:bg-black/70 rounded-full"
              onClick={() => navigateFullscreen("prev")}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-50 text-white bg-black/50 hover:bg-black/70 rounded-full"
              onClick={() => navigateFullscreen("next")}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Image */}
            <div className="flex-grow flex items-center justify-center bg-black">
              {selectedImage && (
                <div className="relative w-full h-full">
                  <Image
                    src={selectedImage.imageUrl || "/placeholder.svg"}
                    alt={selectedImage.title}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>

            {/* Image info */}
            {selectedImage && (
              <div className="bg-black text-white p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold">{selectedImage.title}</h2>
                    <p className="text-white/80">by {selectedImage.cosplayerName}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={likedItems.includes(selectedImage.id) ? "text-pink-600" : "text-white"}
                      onClick={() => handleLike(selectedImage.id)}
                    >
                      <Heart className={`h-5 w-5 ${likedItems.includes(selectedImage.id) ? "fill-pink-600" : ""}`} />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white">
                      <MessageCircle className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {selectedImage.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="border-white/30 text-white">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

