"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Filter, ArrowUpDown } from "lucide-react"

export default function AdminCosplayers() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [cosplayers, setCosplayers] = useState<any[]>([])
  const [filteredCosplayers, setFilteredCosplayers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch cosplayers data
  useEffect(() => {
    const fetchCosplayers = async () => {
      // In a real app, you would fetch this data from your API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Sample data
      const data = [
        {
          id: 1,
          name: "Sakura Cosplay",
          character: "Demon Slayer - Nezuko",
          image: "/placeholder.svg?height=600&width=400",
          tags: ["Demon Slayer", "Anime"],
          bio: "Professional cosplayer specializing in Demon Slayer characters. Award-winning costume designer with 5+ years of experience.",
          popularity: 98,
          status: "active",
          featured: true,
          dateAdded: "2023-05-15",
        },
        {
          id: 2,
          name: "Hiroshi Designs",
          character: "My Hero Academia - Deku",
          image: "/placeholder.svg?height=600&width=400",
          tags: ["My Hero Academia", "Superhero"],
          bio: "Passionate about bringing My Hero Academia characters to life. Specializes in creating detailed hero costumes and props.",
          popularity: 95,
          status: "active",
          featured: true,
          dateAdded: "2023-04-20",
        },
        {
          id: 3,
          name: "Anime Artisan",
          character: "Attack on Titan - Mikasa",
          image: "/placeholder.svg?height=600&width=400",
          tags: ["Attack on Titan", "Action"],
          bio: "Dedicated to creating screen-accurate Attack on Titan cosplays. Expert in leather work and ODM gear replicas.",
          popularity: 92,
          status: "active",
          featured: false,
          dateAdded: "2023-06-10",
        },
        {
          id: 4,
          name: "Cosplay King",
          character: "One Piece - Luffy",
          image: "/placeholder.svg?height=600&width=400",
          tags: ["One Piece", "Shonen"],
          bio: "One Piece enthusiast bringing the Straw Hat crew to life. Known for energetic performances and attention to character details.",
          popularity: 90,
          status: "active",
          featured: false,
          dateAdded: "2023-03-05",
        },
        {
          id: 5,
          name: "Fantasy Forge",
          character: "Naruto - Kakashi",
          image: "/placeholder.svg?height=600&width=400",
          tags: ["Naruto", "Ninja"],
          bio: "Specializing in Naruto universe characters. Creates detailed ninja gear and weapons with a focus on authenticity.",
          popularity: 88,
          status: "inactive",
          featured: false,
          dateAdded: "2023-02-15",
        },
      ]

      setCosplayers(data)
      setFilteredCosplayers(data)
      setIsLoading(false)
    }

    fetchCosplayers()
  }, [])

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
          cosplayer.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      if (categoryFilter === "featured") {
        result = result.filter((cosplayer) => cosplayer.featured)
      } else if (categoryFilter === "active") {
        result = result.filter((cosplayer) => cosplayer.status === "active")
      } else if (categoryFilter === "inactive") {
        result = result.filter((cosplayer) => cosplayer.status === "inactive")
      } else {
        result = result.filter((cosplayer) =>
          cosplayer.tags.some((tag: string) => tag.toLowerCase() === categoryFilter.toLowerCase()),
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
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      case "popularity":
        result.sort((a, b) => b.popularity - a.popularity)
        break
    }

    setFilteredCosplayers(result)
  }, [searchTerm, categoryFilter, sortBy, cosplayers])

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Cosplayers</h1>
          <p className="text-muted-foreground">Manage cosplayer profiles and information</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/admin/cosplayers/new">
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Plus className="mr-2 h-4 w-4" />
              Add New Cosplayer
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
                placeholder="Search cosplayers..."
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
                  <SelectItem value="all">All Cosplayers</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
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
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cosplayers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cosplayers</CardTitle>
          <CardDescription>{filteredCosplayers.length} cosplayers found</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cosplayer</TableHead>
                  <TableHead>Character</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCosplayers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No cosplayers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCosplayers.map((cosplayer) => (
                    <TableRow key={cosplayer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden">
                            <Image
                              src={cosplayer.image || "/placeholder.svg"}
                              alt={cosplayer.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{cosplayer.name}</p>
                            {cosplayer.featured && (
                              <Badge variant="secondary" className="bg-pink-100 text-pink-800 text-xs">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{cosplayer.character}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {cosplayer.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={cosplayer.status === "active" ? "default" : "secondary"}
                          className={
                            cosplayer.status === "active"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }
                        >
                          {cosplayer.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(cosplayer.dateAdded).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {cosplayer.featured ? (
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
                            <DropdownMenuItem>
                              {cosplayer.status === "active" ? (
                                <>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Activate
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
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

