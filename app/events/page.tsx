import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, MapPin } from "lucide-react"

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Cosplay Events</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover upcoming conventions, competitions, workshops, and meetups for anime cosplay enthusiasts.
        </p>
      </div>

      {/* Featured Event */}
      <div className="mb-16">
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative h-64 md:h-auto">
              <Image src="/placeholder.svg?height=600&width=800" alt="Featured Event" fill className="object-cover" />
              <Badge className="absolute top-4 left-4 bg-pink-600 hover:bg-pink-700">Featured</Badge>
            </div>
            <CardContent className="p-6 md:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="border-pink-300 text-pink-800 bg-pink-50">
                  JUL 15-17, 2023
                </Badge>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Anime Cosplay Convention 2023</h2>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="h-4 w-4" />
                <span>Tokyo International Exhibition Center, Japan</span>
              </div>
              <p className="text-muted-foreground mb-6">
                The world's largest anime cosplay convention returns with special guests, competitions, workshops, and
                more. Join thousands of cosplayers for this unforgettable 3-day event.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="secondary">Convention</Badge>
                <Badge variant="secondary">Competition</Badge>
                <Badge variant="secondary">International</Badge>
                <Badge variant="secondary">All Ages</Badge>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-pink-600 hover:bg-pink-700">Register Now</Button>
                <Button variant="outline">Event Details</Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Event Tabs */}
      <Tabs defaultValue="upcoming" className="mb-10">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="workshops">Workshops</TabsTrigger>
          <TabsTrigger value="competitions">Competitions</TabsTrigger>
        </TabsList>

        {/* Upcoming Events */}
        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card
                key={event.id}
                className="overflow-hidden hover:shadow-lg transition-shadow border-l-4 border-pink-500"
              >
                <div className="relative h-48">
                  <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                </div>
                <CardContent className="p-6">
                  <div className="flex gap-4 mb-3">
                    <div className="text-center min-w-16">
                      <div className="bg-pink-100 text-pink-800 font-bold py-1 rounded-t-md">{event.month}</div>
                      <div className="bg-white border border-pink-200 text-3xl font-bold py-2 rounded-b-md">
                        {event.day}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{event.title}</h3>
                      <div className="flex items-center gap-1 text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {event.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-purple-300 text-purple-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Link href={`/events/${event.id}`}>
                    <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Workshops */}
        <TabsContent value="workshops">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map((workshop) => (
              <Card
                key={workshop.id}
                className="overflow-hidden hover:shadow-lg transition-shadow border-l-4 border-purple-500"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarDays className="h-4 w-4" />
                    <span>{workshop.date}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{workshop.title}</h3>
                  <div className="flex items-center gap-1 text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{workshop.location}</span>
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{workshop.description}</p>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {workshop.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-purple-300 text-purple-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">{workshop.price === 0 ? "Free" : `$${workshop.price}`}</div>
                    <Link href={`/events/workshops/${workshop.id}`}>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        Register
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Competitions */}
        <TabsContent value="competitions">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions.map((competition) => (
              <Card
                key={competition.id}
                className="overflow-hidden hover:shadow-lg transition-shadow border-l-4 border-blue-500"
              >
                <div className="relative h-48">
                  <Image
                    src={competition.image || "/placeholder.svg"}
                    alt={competition.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-sm font-bold">
                    {competition.prizePool}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarDays className="h-4 w-4" />
                    <span>{competition.date}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{competition.title}</h3>
                  <div className="flex items-center gap-1 text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{competition.location}</span>
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{competition.description}</p>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {competition.categories.map((category) => (
                      <Badge key={category} variant="outline" className="border-blue-300 text-blue-800">
                        {category}
                      </Badge>
                    ))}
                  </div>
                  <Link href={`/events/competitions/${competition.id}`}>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 w-full">
                      Enter Competition
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Calendar View Button */}
      <div className="flex justify-center mt-10">
        <Button variant="outline" className="gap-2">
          <CalendarDays className="h-4 w-4" />
          View Calendar
        </Button>
      </div>
    </div>
  )
}

// Sample data
const upcomingEvents = [
  {
    id: 1,
    title: "Anime Expo 2023",
    location: "Los Angeles Convention Center",
    month: "JUL",
    day: "4",
    image: "/placeholder.svg?height=400&width=600",
    description:
      "The largest celebration of Japanese pop culture in North America featuring special guests, panels, and cosplay competitions.",
    tags: ["Convention", "Competition"],
  },
  {
    id: 2,
    title: "Cosplay Craftsmanship Workshop",
    location: "Tokyo Creative Space",
    month: "AUG",
    day: "12",
    image: "/placeholder.svg?height=400&width=600",
    description: "Learn advanced techniques for creating professional-quality cosplay costumes from industry experts.",
    tags: ["Workshop", "Beginner Friendly"],
  },
  {
    id: 3,
    title: "Anime Fest",
    location: "New York Comic Center",
    month: "SEP",
    day: "23",
    image: "/placeholder.svg?height=400&width=600",
    description:
      "A weekend celebration of anime, manga, and Japanese culture with special guests, panels, and cosplay contests.",
    tags: ["Festival", "Panels"],
  },
]

const workshops = [
  {
    id: 1,
    title: "Foam Armor Crafting",
    location: "Online (Zoom)",
    date: "June 15, 2023",
    description:
      "Learn how to create lightweight and durable foam armor for your cosplay projects with expert guidance.",
    price: 25,
    tags: ["Beginner", "Materials", "Armor"],
  },
  {
    id: 2,
    title: "Wig Styling Masterclass",
    location: "Cosplay Studio, Los Angeles",
    date: "July 8, 2023",
    description: "Master the art of styling wigs for anime characters with professional techniques and tools.",
    price: 40,
    tags: ["Intermediate", "Hair", "Styling"],
  },
  {
    id: 3,
    title: "Prop Making 101",
    location: "Maker Space, New York",
    date: "July 22, 2023",
    description: "Create impressive props for your cosplay using affordable materials and simple techniques.",
    price: 30,
    tags: ["Beginner", "Props", "Hands-on"],
  },
]

const competitions = [
  {
    id: 1,
    title: "Anime Cosplay Championship",
    location: "Tokyo Dome, Japan",
    date: "August 5-6, 2023",
    image: "/placeholder.svg?height=400&width=600",
    description:
      "The world's premier anime cosplay competition with participants from over 30 countries competing for the grand prize.",
    prizePool: "$10,000",
    categories: ["Craftsmanship", "Performance", "Accuracy"],
  },
  {
    id: 2,
    title: "Demon Slayer Cosplay Contest",
    location: "Anime Convention Center, Los Angeles",
    date: "September 12, 2023",
    image: "/placeholder.svg?height=400&width=600",
    description:
      "Show off your Demon Slayer cosplay skills in this themed competition celebrating the popular anime series.",
    prizePool: "$5,000",
    categories: ["Demon Slayers", "Demons", "Group"],
  },
  {
    id: 3,
    title: "Rookie Cosplayer Showcase",
    location: "Community Center, Chicago",
    date: "October 8, 2023",
    image: "/placeholder.svg?height=400&width=600",
    description:
      "A competition specifically for first-time and beginner cosplayers to showcase their talents in a supportive environment.",
    prizePool: "$2,000",
    categories: ["First-Timer", "Under 18", "Budget"],
  },
]

