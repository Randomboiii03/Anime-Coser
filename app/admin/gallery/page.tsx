"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Filter, ArrowUpDown, Upload, Download } from "lucide-react"

export default function AdminGallery() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [galleryItems, setGalleryItems] = useState<any[]>([])
  const [filteredItems, setFilteredItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  // Fetch gallery data
  useEffect(() => {
    const fetchGalleryItems = async () => {
      // In a real app, you would fetch this data from your API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Sample data
      const data = [
        {
          id: 1,
          title: "Nezuko Kamado",
          cosplayer: "Sakura Cosplay",
          cosplayerId: 1,
          image: "/placeholder.svg?height=400&width=300",
          tags: ["Demon Slayer", "Nezuko"],
          likes: 1245,
          featured: true,
          dateAdded: "2023-05-15",
        },
        {
          id: 2,
          title: "Deku Hero Costume",
          cosplayer: "Hiroshi Designs",
          cosplayerId: 2,
          image: "/placeholder.svg?height=400&width=300",
          tags: ["My Hero Academia", "Deku"],
          likes: 982,
          featured: true,
          dateAdded: "2023-04-28",
        },
        {
          id: 3,
          title: "Mikasa Ackerman",
          cosplayer: "Anime Artisan",
          cosplayerId: 3,
          image: "/placeholder.svg?height=400&width=300",
          tags: ["Attack on Titan", "Mikasa"],
          likes: 876,
          featured: false,
          dateAdded: "2023-06-10",
        },
        {
          id: 4,
          title: "Monkey D. Luffy",
          cosplayer: "Cosplay King",
          cosplayerId: 4,
          image: "/placeholder.svg?height=400&width=300",
          tags: ["One Piece", "Luffy"],
          likes: 1102,
          featured: false,
          dateAdded: "2023-03-05",
        },
        {
          id: 5,
          title: "Kakashi Hatake",
          cosplayer: "Fantasy Forge",
          cosplayerId: 5,
          image: "/placeholder.svg?height=400&width=300",
          tags: ["Naruto", "Kakashi"],
          likes: 934,
          featured: false,
          dateAdded: "2023-02-15",
        },
      ]

      setGalleryItems(data)
      setFilteredItems(data)
      setIsLoading(false)
    }

    fetchGalleryItems()
  }, [])

  // Filter and sort gallery items
  useEffect(() => {
    let result = [...galleryItems]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.cosplayer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      if (categoryFilter === "featured") {
        result = result.filter((item) => item.featured)
      } else {
        result = result.filter((item) =>
          item.tags.some((tag: string) => tag.toLowerCase() === categoryFilter.toLowerCase()),
        )
      }
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime())
        break
      case "title-asc":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "title-desc":
        result.sort((a, b) => b.title.localeCompare(a.title))
        break
      case "popular":
        result.sort((a, b) => b.likes - a.likes)
        break
    }

    setFilteredItems(result)
  }, [searchTerm, categoryFilter, sortBy, galleryItems])

  // Toggle item selection
  const toggleItemSelection = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  // Select all items
  const selectAllItems = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map((item) => item.id))
    }
  }

  // Delete selected items
  const deleteSelectedItems = () => {
    // In a real app, you would call your API to delete the items
    setGalleryItems(galleryItems.filter((item) => !selectedItems.includes(item.id)))
    setSelectedItems([])
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gallery</h1>
          <p className="text-muted-foreground">Manage cosplay photos and images</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Link href="/admin/gallery/upload">
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Upload className="mr-2 h-4 w-4" />
              Upload Images
            </Button>
          </Link>
          <Link href="/admin/gallery/new">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add New Item
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search gallery..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-muted-foreground h-4 w-4" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Images</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="demon slayer">Demon Slayer</SelectItem>
                  <SelectItem value="my hero academia">My Hero Academia</SelectItem>
                  <SelectItem value="attack on titan">Attack on Titan</SelectItem>
                  <SelectItem value="one piece">One Piece</SelectItem>
                  <SelectItem value="naruto">Naruto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="text-muted-foreground h-4 w-4" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                  <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <Card className="mb-6 border-pink-200 bg-pink-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="font-medium">{selectedItems.length} items selected</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={deleteSelectedItems}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gallery Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gallery Items</CardTitle>
              <CardDescription>{filteredItems.length} items found</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={selectAllItems}>
              {selectedItems.length === filteredItems.length ? "Deselect All" : "Select All"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {filteredItems.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No gallery items found</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className={`relative rounded-lg overflow-hidden aspect-square group ${
                        selectedItems.includes(item.id) ? "ring-2 ring-pink-500" : ""
                      }`}
                    >
                      <div
                        className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/40 transition-colors"
                        onClick={() => toggleItemSelection(item.id)}
                      />
                      <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />

                      {/* Selection Checkbox */}
                      <div
                        className={`absolute top-2 left-2 z-20 h-5 w-5 rounded border ${
                          selectedItems.includes(item.id)
                            ? "bg-pink-600 border-pink-600"
                            : "bg-white/80 border-gray-300 group-hover:opacity-100 opacity-0"
                        } transition-opacity`}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleItemSelection(item.id)
                        }}
                      >
                        {selectedItems.includes(item.id) && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>

                      {/* Featured Badge */}
                      {item.featured && <Badge className="absolute top-2 right-2 z-20 bg-pink-600">Featured</Badge>}

                      {/* Item Info */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white font-medium truncate">{item.title}</p>
                        <p className="text-white/80 text-sm truncate">{item.cosplayer}</p>
                      </div>

                      {/* Actions */}
                      <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 bg-black/50 text-white hover:bg-black/70"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {item.featured ? (
                                <>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Remove from Featured
                                </>
                              ) : (
                                <>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Add to Featured
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

