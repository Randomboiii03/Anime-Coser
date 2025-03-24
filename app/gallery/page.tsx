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

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [filteredGallery, setFilteredGallery] = useState(galleryItems)
  const [currentPage, setCurrentPage] = useState(1)
  const [likedItems, setLikedItems] = useState<number[]>([])
  const [selectedImage, setSelectedImage] = useState<(typeof galleryItems)[0] | null>(null)
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
          item.cosplayer.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        result.sort((a, b) => b.id - a.id)
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
  }, [searchTerm, categoryFilter, sortBy])

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredGallery.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredGallery.length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleLike = (id: number) => {
    if (likedItems.includes(id)) {
      setLikedItems(likedItems.filter((itemId) => itemId !== id))
    } else {
      setLikedItems([...likedItems, id])
    }
  }

  const openFullscreen = (item: (typeof galleryItems)[0]) => {
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
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  width={300}
                  height={400}
                  className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold">{item.title}</h3>
                  <p className="text-white/80 text-sm">{item.cosplayer}</p>
                  <div className="flex gap-2 mt-2">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-white/30 text-white">
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
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  width={300}
                  height={item.id % 2 === 0 ? 400 : 300}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold">{item.title}</h3>
                  <p className="text-white/80 text-sm">{item.cosplayer}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-white/30 text-white">
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
                    src={selectedImage.image || "/placeholder.svg"}
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
                    <p className="text-white/80">by {selectedImage.cosplayer}</p>
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
                  {selectedImage.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-white/30 text-white">
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

// Sample data
const galleryItems = [
  {
    id: 1,
    title: "Nezuko Kamado",
    cosplayer: "Sakura Cosplay",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Demon Slayer", "Nezuko"],
    likes: 1245,
  },
  {
    id: 2,
    title: "Deku Hero Costume",
    cosplayer: "Hiroshi Designs",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["My Hero Academia", "Deku"],
    likes: 982,
  },
  {
    id: 3,
    title: "Mikasa Ackerman",
    cosplayer: "Anime Artisan",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Attack on Titan", "Mikasa"],
    likes: 876,
  },
  {
    id: 4,
    title: "Monkey D. Luffy",
    cosplayer: "Cosplay King",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["One Piece", "Luffy"],
    likes: 1102,
  },
  {
    id: 5,
    title: "Kakashi Hatake",
    cosplayer: "Fantasy Forge",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Naruto", "Kakashi"],
    likes: 934,
  },
  {
    id: 6,
    title: "Edward Elric",
    cosplayer: "Anime Alchemist",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Fullmetal Alchemist", "Edward"],
    likes: 756,
  },
  {
    id: 7,
    title: "Asuka Langley",
    cosplayer: "Mecha Master",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Evangelion", "Asuka"],
    likes: 689,
  },
  {
    id: 8,
    title: "Sailor Jupiter",
    cosplayer: "Magical Cosplay",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Sailor Moon", "Jupiter"],
    likes: 723,
  },
  {
    id: 9,
    title: "Tanjiro Kamado",
    cosplayer: "Blade Cosplay",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Demon Slayer", "Tanjiro"],
    likes: 1056,
  },
  {
    id: 10,
    title: "Bakugo Katsuki",
    cosplayer: "Explosion Cosplay",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["My Hero Academia", "Bakugo"],
    likes: 945,
  },
  {
    id: 11,
    title: "Levi Ackerman",
    cosplayer: "Scout Regiment",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Attack on Titan", "Levi"],
    likes: 1320,
  },
  {
    id: 12,
    title: "Nico Robin",
    cosplayer: "Pirate Queen",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["One Piece", "Robin"],
    likes: 867,
  },
  {
    id: 13,
    title: "Hinata Hyuga",
    cosplayer: "Ninja Way",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Naruto", "Hinata"],
    likes: 789,
  },
  {
    id: 14,
    title: "Alphonse Elric",
    cosplayer: "Anime Alchemist",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Fullmetal Alchemist", "Alphonse"],
    likes: 678,
  },
  {
    id: 15,
    title: "Rei Ayanami",
    cosplayer: "Mecha Master",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Evangelion", "Rei"],
    likes: 712,
  },
  {
    id: 16,
    title: "Sailor Mercury",
    cosplayer: "Magical Cosplay",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Sailor Moon", "Mercury"],
    likes: 654,
  },
  {
    id: 17,
    title: "Zenitsu Agatsuma",
    cosplayer: "Blade Cosplay",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Demon Slayer", "Zenitsu"],
    likes: 932,
  },
  {
    id: 18,
    title: "Ochaco Uraraka",
    cosplayer: "Explosion Cosplay",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["My Hero Academia", "Uraraka"],
    likes: 876,
  },
  {
    id: 19,
    title: "Eren Yeager",
    cosplayer: "Scout Regiment",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Attack on Titan", "Eren"],
    likes: 1089,
  },
  {
    id: 20,
    title: "Nami",
    cosplayer: "Pirate Queen",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["One Piece", "Nami"],
    likes: 943,
  },
  {
    id: 21,
    title: "Sasuke Uchiha",
    cosplayer: "Ninja Way",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Naruto", "Sasuke"],
    likes: 1156,
  },
  {
    id: 22,
    title: "Winry Rockbell",
    cosplayer: "Anime Alchemist",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Fullmetal Alchemist", "Winry"],
    likes: 645,
  },
  {
    id: 23,
    title: "Shinji Ikari",
    cosplayer: "Mecha Master",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Evangelion", "Shinji"],
    likes: 578,
  },
  {
    id: 24,
    title: "Sailor Venus",
    cosplayer: "Magical Cosplay",
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Sailor Moon", "Venus"],
    likes: 687,
  },
]

