"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Filter, ArrowUpDown, Calendar, MapPin } from "lucide-react"

export default function AdminEvents() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("upcoming")
  const [events, setEvents] = useState<any[]>([])
  const [filteredEvents, setFilteredEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch events data
  useEffect(() => {
    const fetchEvents = async () => {
      // In a real app, you would fetch this data from your API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Sample data
      const data = [
        {
          id: 1,
          title: "Anime Expo 2023",
          type: "convention",
          location: "Los Angeles Convention Center",
          startDate: "2023-07-04",
          endDate: "2023-07-07",
          image: "/placeholder.svg?height=400&width=600",
          description:
            "The largest celebration of Japanese pop culture in North America featuring special guests, panels, and cosplay competitions.",
          status: "upcoming",
          featured: true,
        },
        {
          id: 2,
          title: "Cosplay Craftsmanship Workshop",
          type: "workshop",
          location: "Tokyo Creative Space",
          startDate: "2023-08-12",
          endDate: "2023-08-12",
          image: "/placeholder.svg?height=400&width=600",
          description:
            "Learn advanced techniques for creating professional-quality cosplay costumes from industry experts.",
          status: "upcoming",
          featured: false,
        },
        {
          id: 3,
          title: "Anime Fest",
          type: "festival",
          location: "New York Comic Center",
          startDate: "2023-09-23",
          endDate: "2023-09-24",
          image: "/placeholder.svg?height=400&width=600",
          description:
            "A weekend celebration of anime, manga, and Japanese culture with special guests, panels, and cosplay contests.",
          status: "upcoming",
          featured: true,
        },
        {
          id: 4,
          title: "Demon Slayer Cosplay Contest",
          type: "competition",
          location: "Anime Convention Center, Los Angeles",
          startDate: "2023-09-12",
          endDate: "2023-09-12",
          image: "/placeholder.svg?height=400&width=600",
          description:
            "Show off your Demon Slayer cosplay skills in this themed competition celebrating the popular anime series.",
          status: "upcoming",
          featured: false,
        },
        {
          id: 5,
          title: "Tokyo Comic Con",
          type: "convention",
          location: "Tokyo Big Sight",
          startDate: "2023-12-12",
          endDate: "2023-12-14",
          image: "/placeholder.svg?height=400&width=600",
          description:
            "Japan's premier comic and pop culture convention featuring international guests, exhibits, and cosplay competitions.",
          status: "upcoming",
          featured: false,
        },
      ]

      setEvents(data)
      setFilteredEvents(data)
      setIsLoading(false)
    }

    fetchEvents()
  }, [])

  // Filter and sort events
  useEffect(() => {
    let result = [...events]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply type filter
    if (typeFilter !== "all") {
      if (typeFilter === "featured") {
        result = result.filter((event) => event.featured)
      } else {
        result = result.filter((event) => event.type === typeFilter)
      }
    }

    // Apply sorting
    switch (sortBy) {
      case "upcoming":
        result.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        break
      case "title-asc":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "title-desc":
        result.sort((a, b) => b.title.localeCompare(a.title))
        break
      case "location":
        result.sort((a, b) => a.location.localeCompare(b.location))
        break
    }

    setFilteredEvents(result)
  }, [searchTerm, typeFilter, sortBy, events])

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">Manage conventions, workshops, and competitions</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/admin/events/new">
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Plus className="mr-2 h-4 w-4" />
              Add New Event
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
                placeholder="Search events..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-muted-foreground h-4 w-4" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="convention">Conventions</SelectItem>
                  <SelectItem value="workshop">Workshops</SelectItem>
                  <SelectItem value="competition">Competitions</SelectItem>
                  <SelectItem value="festival">Festivals</SelectItem>
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
                  <SelectItem value="upcoming">Upcoming First</SelectItem>
                  <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                  <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Tabs */}
      <Tabs defaultValue="list" className="mb-6">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        {/* List View */}
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Events</CardTitle>
              <CardDescription>{filteredEvents.length} events found</CardDescription>
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
                      <TableHead>Event</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No events found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEvents.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded overflow-hidden">
                                <Image
                                  src={event.image || "/placeholder.svg"}
                                  alt={event.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">{event.title}</p>
                                {event.featured && (
                                  <Badge variant="secondary" className="bg-pink-100 text-pink-800 text-xs">
                                    Featured
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                event.type === "convention"
                                  ? "border-blue-300 text-blue-800"
                                  : event.type === "workshop"
                                    ? "border-green-300 text-green-800"
                                    : event.type === "competition"
                                      ? "border-purple-300 text-purple-800"
                                      : "border-orange-300 text-orange-800"
                              }
                            >
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span>{event.location}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span>
                                {new Date(event.startDate).toLocaleDateString()}
                                {event.endDate !== event.startDate &&
                                  ` - ${new Date(event.endDate).toLocaleDateString()}`}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={event.status === "upcoming" ? "default" : "secondary"}
                              className={
                                event.status === "upcoming"
                                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              }
                            >
                              {event.status === "upcoming" ? "Upcoming" : "Past"}
                            </Badge>
                          </TableCell>
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
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  {event.featured ? (
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
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar View */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Event Calendar</CardTitle>
              <CardDescription>View events in calendar format</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[500px] bg-muted rounded animate-pulse" />
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-7 bg-muted">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="p-2 text-center font-medium">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 auto-rows-fr">
                    {/* Generate calendar days - this is a simplified example */}
                    {Array.from({ length: 35 }, (_, i) => {
                      const day = i + 1
                      const hasEvent = events.some((event) => {
                        const eventDate = new Date(event.startDate)
                        return eventDate.getDate() === day && eventDate.getMonth() === 6 // July
                      })

                      return (
                        <div
                          key={i}
                          className={`border p-1 min-h-[100px] ${day > 31 ? "bg-muted/30 text-muted-foreground" : ""}`}
                        >
                          <div className="text-sm p-1">{day <= 31 ? day : day - 31}</div>
                          {hasEvent && day <= 31 && (
                            <div className="mt-1">
                              {events
                                .filter((event) => {
                                  const eventDate = new Date(event.startDate)
                                  return eventDate.getDate() === day && eventDate.getMonth() === 6 // July
                                })
                                .map((event) => (
                                  <div
                                    key={event.id}
                                    className={`text-xs p-1 mb-1 rounded truncate ${
                                      event.type === "convention"
                                        ? "bg-blue-100 text-blue-800"
                                        : event.type === "workshop"
                                          ? "bg-green-100 text-green-800"
                                          : event.type === "competition"
                                            ? "bg-purple-100 text-purple-800"
                                            : "bg-orange-100 text-orange-800"
                                    }`}
                                  >
                                    {event.title}
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

