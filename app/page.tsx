import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Heart, Instagram, Twitter } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-600/80 z-10" />
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Cosplay Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Anime Cosplay Universe</h1>
          <p className="text-xl text-white/90 max-w-2xl mb-8">
            Discover amazing cosplayers, tutorials, events and more in the world of anime cosplay
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
              Explore Gallery
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/20">
              Upcoming Events
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Cosplayers */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Featured Cosplayers</h2>
          <Link href="/cosplayers" className="text-pink-600 hover:text-pink-700 flex items-center">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCosplayers.map((cosplayer) => (
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
                  <Button variant="ghost" size="icon" className="text-pink-600">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex gap-2 mb-4">
                  {cosplayer.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-3 mt-4">
                  <Button variant="ghost" size="icon" className="text-blue-600">
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-pink-600">
                    <Instagram className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Cosplayers */}
      <section className="py-16 bg-purple-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Cosplayers</h2>
            <Link href="/cosplayers/featured" className="text-pink-600 hover:text-pink-700 flex items-center">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCosplayers.map((cosplayer) => (
              <Card key={cosplayer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-80">
                  <Image
                    src={cosplayer.image || "/placeholder.svg"}
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
                    <Button variant="ghost" size="icon" className="text-pink-600">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex gap-2 mb-4">
                    {cosplayer.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-purple-100 text-purple-800 hover:bg-purple-200"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Link href={`/cosplayers/${cosplayer.id}`}>
                    <Button variant="outline" className="w-full">
                      View Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Upcoming Events</h2>
          <Link href="/events" className="text-pink-600 hover:text-pink-700 flex items-center">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Card
              key={event.id}
              className="overflow-hidden hover:shadow-lg transition-shadow border-l-4 border-pink-500"
            >
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="text-center min-w-16">
                    <div className="bg-pink-100 text-pink-800 font-bold py-1 rounded-t-md">{event.month}</div>
                    <div className="bg-white border border-pink-200 text-3xl font-bold py-2 rounded-b-md">
                      {event.day}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{event.title}</h3>
                    <p className="text-muted-foreground mb-3">{event.location}</p>
                    <div className="flex gap-2 mb-4">
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
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-purple-700 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Cosplay Community</h2>
          <p className="max-w-2xl mx-auto mb-8 text-white/90">
            Subscribe to our newsletter to get the latest updates on events, tutorials, and featured cosplayers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-2 rounded-md flex-grow text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <Button className="bg-white text-pink-600 hover:bg-gray-100">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  )
}

// Sample data
const featuredCosplayers = [
  {
    id: 1,
    name: "Sakura Cosplay",
    character: "Demon Slayer - Nezuko",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["Demon Slayer", "Anime"],
  },
  {
    id: 2,
    name: "Hiroshi Designs",
    character: "My Hero Academia - Deku",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["My Hero Academia", "Superhero"],
  },
  {
    id: 3,
    name: "Anime Artisan",
    character: "Attack on Titan - Mikasa",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["Attack on Titan", "Action"],
  },
]

const events = [
  {
    id: 1,
    title: "Anime Expo 2023",
    location: "Los Angeles Convention Center",
    month: "JUL",
    day: "4",
    tags: ["Convention", "Competition"],
  },
  {
    id: 2,
    title: "Cosplay Craftsmanship Workshop",
    location: "Tokyo Creative Space",
    month: "AUG",
    day: "12",
    tags: ["Workshop", "Beginner Friendly"],
  },
  {
    id: 3,
    title: "Anime Fest",
    location: "New York Comic Center",
    month: "SEP",
    day: "23",
    tags: ["Festival", "Panels"],
  },
]

