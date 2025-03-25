import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, MapPin } from "lucide-react"
import { getEvents, getEventsByType, getFeaturedEvents } from "@/lib/api/events"

export const revalidate = 3600 // Revalidate every hour

export default async function EventsPage() {
  const [allEvents, featuredEvents, workshops, competitions] = await Promise.all([
    getEvents(),
    getFeaturedEvents(),
    getEventsByType("workshop"),
    getEventsByType("competition"),
  ])

  // Filter upcoming events
  const today = new Date().toISOString().split("T")[0]
  const upcomingEvents = allEvents
    .filter((event) => event.date >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)

  // Get featured event
  const featuredEvent = featuredEvents.length > 0 ? featuredEvents[0] : null

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Cosplay Events</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover upcoming conventions, competitions, workshops, and meetups for anime cosplay enthusiasts.
        </p>
      </div>

      {/* Featured Event */}
      {featuredEvent && (
        <div className="mb-16">
          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative h-64 md:h-auto">
                <Image
                  src={featuredEvent.imageUrl || "/placeholder.svg"}
                  alt={featuredEvent.title}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-pink-600 hover:bg-pink-700">Featured</Badge>
              </div>
              <CardContent className="p-6 md:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="border-pink-300 text-pink-800 bg-pink-50">
                    {new Date(featuredEvent.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {featuredEvent.endDate &&
                      ` - ${new Date(featuredEvent.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
                  </Badge>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{featuredEvent.title}</h2>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4" />
                  <span>{featuredEvent.location}</span>
                </div>
                <p className="text-muted-foreground mb-6">{featuredEvent.description}</p>
                <div className="flex flex-wrap gap-3 mb-6">
                  {featuredEvent.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-pink-600 hover:bg-pink-700">Register Now</Button>
                  <Button variant="outline">Event Details</Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      )}

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
                  <Image src={event.imageUrl || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                </div>
                <CardContent className="p-6">
                  <div className="flex gap-4 mb-3">
                    <div className="text-center min-w-16">
                      <div className="bg-pink-100 text-pink-800 font-bold py-1 rounded-t-md">
                        {new Date(event.date).toLocaleDateString("en-US", { month: "short" }).toUpperCase()}
                      </div>
                      <div className="bg-white border border-pink-200 text-3xl font-bold py-2 rounded-b-md">
                        {new Date(event.date).getDate()}
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
                    {event.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="border-purple-300 text-purple-800">
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
                    <span>
                      {new Date(workshop.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{workshop.title}</h3>
                  <div className="flex items-center gap-1 text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{workshop.location}</span>
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{workshop.description}</p>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {workshop.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="border-purple-300 text-purple-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">Free Workshop</div>
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
                    src={competition.imageUrl || "/placeholder.svg"}
                    alt={competition.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-sm font-bold">
                    Prize Pool
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarDays className="h-4 w-4" />
                    <span>
                      {new Date(competition.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{competition.title}</h3>
                  <div className="flex items-center gap-1 text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{competition.location}</span>
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{competition.description}</p>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {competition.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="border-blue-300 text-blue-800">
                        {tag}
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

