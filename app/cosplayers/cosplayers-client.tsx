"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Instagram, Twitter } from "lucide-react"
import type { Cosplayer } from "@/lib/api/cosplayers"

export default function CosplayersClient({ initialCosplayers }: { initialCosplayers: Cosplayer[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [cosplayers, setCosplayers] = useState<Cosplayer[]>(initialCosplayers)
  const [filteredCosplayers, setFilteredCosplayers] = useState<Cosplayer[]>(initialCosplayers)
  const [currentPage, setCurrentPage] = useState(1)
  const [likedCosplayers, setLikedCosplayers] = useState<number[]>([])

  const cosplayersPerPage = 8

  // Filter and sort cosplayers
  useEffect(() => {
    let result = [...cosplayers]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (cosplayer) =>
          cosplayer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cosplayer.character.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cosplayer.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cosplayer.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter((cosplayer) =>
        cosplayer.tags.some((tag) => tag.toLowerCase() === categoryFilter.toLowerCase()),
      )
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      case "popular":
        result.sort((a, b) => b.popularity - a.popularity)
        break
    }

    setFilteredCosplayers(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchTerm, categoryFilter, sortBy, cosplayers])

  // Calculate pagination
  const indexOfLastCosplayer = currentPage * cosplayersPerPage
  const indexOfFirstCosplayer = indexOfLastCosplayer - cosplayersPerPage
  const currentCosplayers = filteredCosplayers.slice(indexOfFirstCosplayer, indexOfLastCosplayer)
  const totalPages = Math.ceil(filteredCosplayers.length / cosplayersPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleLike = (id: number) => {
    if (likedCosplayers.includes(id)) {
      setLikedCosplayers(likedCosplayers.filter((cosplayerId) => cosplayerId !== id))
    } else {
      setLikedCosplayers([...likedCosplayers, id])
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Cosplayer Directory</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover talented cosplayers from around the world. Browse profiles, view their work, and connect with your
          favorites.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-muted p-6 rounded-lg mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              placeholder="Search cosplayers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by anime" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Anime</SelectItem>
                <SelectItem value="demon slayer">Demon Slayer</SelectItem>
                <SelectItem value="my hero academia">My Hero Academia</SelectItem>
                <SelectItem value="attack on titan">Attack on Titan</SelectItem>
                <SelectItem value="one piece">One Piece</SelectItem>
                <SelectItem value="naruto">Naruto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Cosplayers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentCosplayers.map((cosplayer) => (
          <Card key={cosplayer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-80">
              <Image
                src={cosplayer.profileImage || "/placeholder.svg"}
                alt={cosplayer.name}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold">{cosplayer.name}</h3>
                  <p className="text-muted-foreground">{cosplayer.character}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={likedCosplayers.includes(cosplayer.id) ? "text-pink-600" : "text-muted-foreground"}
                  onClick={() => handleLike(cosplayer.id)}
                >
                  <Heart className={`h-5 w-5 ${likedCosplayers.includes(cosplayer.id) ? "fill-pink-600" : ""}`} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {cosplayer.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{cosplayer.bio}</p>
              <div className="flex gap-3 mt-4">
                <Button variant="ghost" size="icon" className="text-blue-600">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-pink-600">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Link href={`/cosplayers/${cosplayer.id}`} className="ml-auto">
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
    </div>
  )
}

