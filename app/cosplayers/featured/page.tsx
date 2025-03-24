"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Instagram, Twitter } from "lucide-react"

export default function FeaturedCosplayersPage() {
  const [likedCosplayers, setLikedCosplayers] = useState<number[]>([])

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
        <h1 className="text-4xl font-bold mb-4">Featured Cosplayers</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our handpicked selection of the most talented and creative cosplayers from around the world.
        </p>
      </div>

      {/* Hero Featured Cosplayer */}
      <div className="mb-16">
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative h-64 md:h-auto">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Top Featured Cosplayer"
                fill
                className="object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-pink-600 hover:bg-pink-700">Cosplayer of the Month</Badge>
            </div>
            <CardContent className="p-6 md:p-8 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Sakura Cosplay</h2>
              <p className="text-muted-foreground mb-4">Tokyo, Japan</p>
              <p className="mb-6">
                Professional cosplayer specializing in Demon Slayer characters. Award-winning costume designer with 5+
                years of experience.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                  Demon Slayer
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                  Costume Design
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                  Makeup
                </Badge>
              </div>
              <div className="flex gap-4">
                <Link href="/cosplayers/1">
                  <Button className="bg-pink-600 hover:bg-pink-700">View Profile</Button>
                </Link>
                <Button variant="outline" className="gap-2">
                  <Instagram className="h-4 w-4" />
                  Follow
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Featured Cosplayers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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

      {/* Upcoming Featured Cosplayers */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">Upcoming Featured Cosplayers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {upcomingFeatured.map((cosplayer) => (
            <div key={cosplayer.id} className="text-center">
              <div className="relative rounded-full overflow-hidden w-32 h-32 mx-auto mb-3">
                <Image
                  src={cosplayer.image || "/placeholder.svg?height=200&width=200"}
                  alt={cosplayer.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-bold">{cosplayer.name}</h3>
              <p className="text-sm text-muted-foreground">{cosplayer.specialty}</p>
              <p className="text-sm text-pink-600 mt-1">Coming {cosplayer.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-20 text-center bg-muted p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Want to be featured?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          We're always looking for talented cosplayers to feature on our platform. If you'd like to be considered,
          submit your portfolio today!
        </p>
        <Button className="bg-pink-600 hover:bg-pink-700">Submit Your Portfolio</Button>
      </div>
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
    bio: "Professional cosplayer specializing in Demon Slayer characters. Award-winning costume designer with 5+ years of experience.",
  },
  {
    id: 2,
    name: "Hiroshi Designs",
    character: "My Hero Academia - Deku",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["My Hero Academia", "Superhero"],
    bio: "Passionate about bringing My Hero Academia characters to life. Specializes in creating detailed hero costumes and props.",
  },
  {
    id: 3,
    name: "Anime Artisan",
    character: "Attack on Titan - Mikasa",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["Attack on Titan", "Action"],
    bio: "Dedicated to creating screen-accurate Attack on Titan cosplays. Expert in leather work and ODM gear replicas.",
  },
  {
    id: 4,
    name: "Cosplay King",
    character: "One Piece - Luffy",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["One Piece", "Shonen"],
    bio: "One Piece enthusiast bringing the Straw Hat crew to life. Known for energetic performances and attention to character details.",
  },
  {
    id: 5,
    name: "Fantasy Forge",
    character: "Naruto - Kakashi",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["Naruto", "Ninja"],
    bio: "Specializing in Naruto universe characters. Creates detailed ninja gear and weapons with a focus on authenticity.",
  },
  {
    id: 6,
    name: "Anime Alchemist",
    character: "Fullmetal Alchemist - Edward Elric",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["Fullmetal Alchemist", "Fantasy"],
    bio: "Metalwork expert creating stunning Fullmetal Alchemist cosplays. Specializes in automail arm replicas and alchemical details.",
  },
]

const upcomingFeatured = [
  {
    id: 7,
    name: "Mecha Master",
    specialty: "Evangelion",
    date: "Next Week",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 8,
    name: "Magical Cosplay",
    specialty: "Sailor Moon",
    date: "In 2 Weeks",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 9,
    name: "Blade Cosplay",
    specialty: "Demon Slayer",
    date: "This Month",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 10,
    name: "Explosion Cosplay",
    specialty: "My Hero Academia",
    date: "Next Month",
    image: "/placeholder.svg?height=200&width=200",
  },
]

