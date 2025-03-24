"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Instagram, Twitter } from "lucide-react"

export default function CosplayersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [animeFilter, setAnimeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [filteredCosplayers, setFilteredCosplayers] = useState(cosplayers)
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

    // Apply anime filter
    if (animeFilter !== "all") {
      result = result.filter((cosplayer) =>
        cosplayer.tags.some((tag) => tag.toLowerCase() === animeFilter.toLowerCase()),
      )
    }

    // Apply sorting
    switch (sortBy) {
      case "popular":
        result.sort((a, b) => b.popularity - a.popularity)
        break
      case "recent":
        result.sort((a, b) => new Date(b.added).getTime() - new Date(a.added).getTime())
        break
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
    }

    setFilteredCosplayers(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchTerm, animeFilter, sortBy])

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
            <Select value={animeFilter} onValueChange={setAnimeFilter}>
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
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="recent">Recently Added</SelectItem>
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
              <Image src={cosplayer.image || "/placeholder.svg"} alt={cosplayer.name} fill className="object-cover" />
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

// Sample data
const cosplayers = [
  {
    id: 1,
    name: "Sakura Cosplay",
    character: "Demon Slayer - Nezuko",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["Demon Slayer", "Anime"],
    bio: "Professional cosplayer specializing in Demon Slayer characters. Award-winning costume designer with 5+ years of experience.",
    popularity: 98,
    added: "2023-05-15",
  },
  {
    id: 2,
    name: "Hiroshi Designs",
    character: "My Hero Academia - Deku",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["My Hero Academia", "Superhero"],
    bio: "Passionate about bringing My Hero Academia characters to life. Specializes in creating detailed hero costumes and props.",
    popularity: 95,
    added: "2023-04-20",
  },
  {
    id: 3,
    name: "Anime Artisan",
    character: "Attack on Titan - Mikasa",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["Attack on Titan", "Action"],
    bio: "Dedicated to creating screen-accurate Attack on Titan cosplays. Expert in leather work and ODM gear replicas.",
    popularity: 92,
    added: "2023-06-10",
  },
  {
    id: 4,
    name: "Cosplay King",
    character: "One Piece - Luffy",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["One Piece", "Shonen"],
    bio: "One Piece enthusiast bringing the Straw Hat crew to life. Known for energetic performances and attention to character details.",
    popularity: 90,
    added: "2023-03-05",
  },
  {
    id: 5,
    name: "Fantasy Forge",
    character: "Naruto - Kakashi",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["Naruto", "Ninja"],
    bio: "Specializing in Naruto universe characters. Creates detailed ninja gear and weapons with a focus on authenticity.",
    popularity: 88,
    added: "2023-02-15",
  },
  {
    id: 6,
    name: "Anime Alchemist",
    character: "Fullmetal Alchemist - Edward Elric",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["Fullmetal Alchemist", "Fantasy"],
    bio: "Metalwork expert creating stunning Fullmetal Alchemist cosplays. Specializes in automail arm replicas and alchemical details.",
    popularity: 85,
    added: "2023-01-20",
  },
  {
    id: 7,
    name: "Mecha Master",
    character: "Evangelion - Asuka",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["Evangelion", "Mecha"],
    bio: "Focused on creating detailed plugsuits and EVA unit designs. Passionate about mecha anime and complex costume engineering.",
    popularity: 82,
    added: "2023-07-01",
  },
  {
    id: 8,
    name: "Magical Cosplay",
    character: "Sailor Moon - Sailor Jupiter",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["Sailor Moon", "Magical Girl"],
    bio: "Bringing magical girl anime to life with a focus on Sailor Moon characters. Creates handmade accessories and detailed costumes.",
    popularity: 80,
    added: "2023-06-25",
  },
  {
    id: 9,
    name: "Blade Cosplay",
    character: "Demon Slayer - Tanjiro",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["Demon Slayer", "Swordsman"],
    bio: "Specializing in male Demon Slayer characters with a focus on authentic sword replicas and detailed uniform recreation.",
    popularity: 78,
    added: "2023-05-30",
  },
  {
    id: 10,
    name: "Explosion Cosplay",
    character: "My Hero Academia - Bakugo",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["My Hero Academia", "Superhero"],
    bio: "Creating explosive My Hero Academia cosplays with special effects and detailed prop work. Specializes in Bakugo's gauntlets.",
    popularity: 75,
    added: "2023-04-15",
  },
  {
    id: 11,
    name: "Scout Regiment",
    character: "Attack on Titan - Levi",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["Attack on Titan", "Military"],
    bio: "Military precision in Attack on Titan cosplays. Creates screen-accurate ODM gear and Survey Corps uniforms.",
    popularity: 72,
    added: "2023-03-20",
  },
  {
    id: 12,
    name: "Pirate Queen",
    character: "One Piece - Nico Robin",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["One Piece", "Pirate"],
    bio: "Bringing the women of One Piece to life with detailed costume work and character-accurate styling.",
    popularity: 70,
    added: "2023-02-10",
  },
]

