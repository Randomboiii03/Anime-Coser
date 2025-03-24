"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Instagram, Twitter } from "lucide-react"

export default function CosplayerCategoriesPage() {
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
        <h1 className="text-4xl font-bold mb-4">Cosplayers by Category</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Browse cosplayers by your favorite anime series, character types, or specialties.
        </p>
      </div>

      {/* Category Tabs */}
      <Tabs defaultValue="demon-slayer" className="mb-10">
        <TabsList className="flex flex-wrap h-auto justify-center mb-8">
          <TabsTrigger value="demon-slayer">Demon Slayer</TabsTrigger>
          <TabsTrigger value="my-hero-academia">My Hero Academia</TabsTrigger>
          <TabsTrigger value="attack-on-titan">Attack on Titan</TabsTrigger>
          <TabsTrigger value="one-piece">One Piece</TabsTrigger>
          <TabsTrigger value="naruto">Naruto</TabsTrigger>
          <TabsTrigger value="other">Other Anime</TabsTrigger>
        </TabsList>

        {/* Demon Slayer Tab */}
        <TabsContent value="demon-slayer">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cosplayers
              .filter((cosplayer) => cosplayer.categories.includes("Demon Slayer"))
              .map((cosplayer) => (
                <CosplayerCard
                  key={cosplayer.id}
                  cosplayer={cosplayer}
                  isLiked={likedCosplayers.includes(cosplayer.id)}
                  onLike={() => handleLike(cosplayer.id)}
                />
              ))}
          </div>
        </TabsContent>

        {/* My Hero Academia Tab */}
        <TabsContent value="my-hero-academia">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cosplayers
              .filter((cosplayer) => cosplayer.categories.includes("My Hero Academia"))
              .map((cosplayer) => (
                <CosplayerCard
                  key={cosplayer.id}
                  cosplayer={cosplayer}
                  isLiked={likedCosplayers.includes(cosplayer.id)}
                  onLike={() => handleLike(cosplayer.id)}
                />
              ))}
          </div>
        </TabsContent>

        {/* Attack on Titan Tab */}
        <TabsContent value="attack-on-titan">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cosplayers
              .filter((cosplayer) => cosplayer.categories.includes("Attack on Titan"))
              .map((cosplayer) => (
                <CosplayerCard
                  key={cosplayer.id}
                  cosplayer={cosplayer}
                  isLiked={likedCosplayers.includes(cosplayer.id)}
                  onLike={() => handleLike(cosplayer.id)}
                />
              ))}
          </div>
        </TabsContent>

        {/* One Piece Tab */}
        <TabsContent value="one-piece">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cosplayers
              .filter((cosplayer) => cosplayer.categories.includes("One Piece"))
              .map((cosplayer) => (
                <CosplayerCard
                  key={cosplayer.id}
                  cosplayer={cosplayer}
                  isLiked={likedCosplayers.includes(cosplayer.id)}
                  onLike={() => handleLike(cosplayer.id)}
                />
              ))}
          </div>
        </TabsContent>

        {/* Naruto Tab */}
        <TabsContent value="naruto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cosplayers
              .filter((cosplayer) => cosplayer.categories.includes("Naruto"))
              .map((cosplayer) => (
                <CosplayerCard
                  key={cosplayer.id}
                  cosplayer={cosplayer}
                  isLiked={likedCosplayers.includes(cosplayer.id)}
                  onLike={() => handleLike(cosplayer.id)}
                />
              ))}
          </div>
        </TabsContent>

        {/* Other Anime Tab */}
        <TabsContent value="other">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cosplayers
              .filter(
                (cosplayer) =>
                  !["Demon Slayer", "My Hero Academia", "Attack on Titan", "One Piece", "Naruto"].some((category) =>
                    cosplayer.categories.includes(category),
                  ),
              )
              .map((cosplayer) => (
                <CosplayerCard
                  key={cosplayer.id}
                  cosplayer={cosplayer}
                  isLiked={likedCosplayers.includes(cosplayer.id)}
                  onLike={() => handleLike(cosplayer.id)}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Popular Categories */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Popular Cosplay Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {popularCategories.map((category, index) => (
            <Link href={`/cosplayers/categories?category=${category.slug}`} key={index} className="group">
              <div className="relative rounded-lg overflow-hidden aspect-square">
                <Image
                  src={category.image || "/placeholder.svg?height=400&width=400"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-4 w-full">
                    <h3 className="text-white font-bold text-lg">{category.name}</h3>
                    <p className="text-white/80 text-sm">{category.count} cosplayers</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// Cosplayer Card Component
function CosplayerCard({
  cosplayer,
  isLiked,
  onLike,
}: {
  cosplayer: (typeof cosplayers)[0]
  isLiked: boolean
  onLike: () => void
}) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
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
            className={isLiked ? "text-pink-600" : "text-muted-foreground"}
            onClick={onLike}
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-pink-600" : ""}`} />
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
    categories: ["Demon Slayer"],
    bio: "Professional cosplayer specializing in Demon Slayer characters. Award-winning costume designer with 5+ years of experience.",
  },
  {
    id: 2,
    name: "Hiroshi Designs",
    character: "My Hero Academia - Deku",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["My Hero Academia", "Superhero"],
    categories: ["My Hero Academia"],
    bio: "Passionate about bringing My Hero Academia characters to life. Specializes in creating detailed hero costumes and props.",
  },
  {
    id: 3,
    name: "Anime Artisan",
    character: "Attack on Titan - Mikasa",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["Attack on Titan", "Action"],
    categories: ["Attack on Titan"],
    bio: "Dedicated to creating screen-accurate Attack on Titan cosplays. Expert in leather work and ODM gear replicas.",
  },
  {
    id: 4,
    name: "Cosplay King",
    character: "One Piece - Luffy",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["One Piece", "Shonen"],
    categories: ["One Piece"],
    bio: "One Piece enthusiast bringing the Straw Hat crew to life. Known for energetic performances and attention to character details.",
  },
  {
    id: 5,
    name: "Fantasy Forge",
    character: "Naruto - Kakashi",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["Naruto", "Ninja"],
    categories: ["Naruto"],
    bio: "Specializing in Naruto universe characters. Creates detailed ninja gear and weapons with a focus on authenticity.",
  },
  {
    id: 6,
    name: "Anime Alchemist",
    character: "Fullmetal Alchemist - Edward Elric",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["Fullmetal Alchemist", "Fantasy"],
    categories: ["Fullmetal Alchemist"],
    bio: "Metalwork expert creating stunning Fullmetal Alchemist cosplays. Specializes in automail arm replicas and alchemical details.",
  },
  {
    id: 7,
    name: "Blade Cosplay",
    character: "Demon Slayer - Tanjiro",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["Demon Slayer", "Swordsman"],
    categories: ["Demon Slayer"],
    bio: "Specializing in male Demon Slayer characters with a focus on authentic sword replicas and detailed uniform recreation.",
  },
  {
    id: 8,
    name: "Explosion Cosplay",
    character: "My Hero Academia - Bakugo",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["My Hero Academia", "Superhero"],
    categories: ["My Hero Academia"],
    bio: "Creating explosive My Hero Academia cosplays with special effects and detailed prop work. Specializes in Bakugo's gauntlets.",
  },
  {
    id: 9,
    name: "Scout Regiment",
    character: "Attack on Titan - Levi",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["Attack on Titan", "Military"],
    categories: ["Attack on Titan"],
    bio: "Military precision in Attack on Titan cosplays. Creates screen-accurate ODM gear and Survey Corps uniforms.",
  },
  {
    id: 10,
    name: "Pirate Queen",
    character: "One Piece - Nico Robin",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["One Piece", "Pirate"],
    categories: ["One Piece"],
    bio: "Bringing the women of One Piece to life with detailed costume work and character-accurate styling.",
  },
  {
    id: 11,
    name: "Ninja Way",
    character: "Naruto - Hinata",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["Naruto", "Ninja"],
    categories: ["Naruto"],
    bio: "Dedicated to creating accurate Naruto character cosplays with a focus on the Hyuga clan techniques and styling.",
  },
  {
    id: 12,
    name: "Magical Cosplay",
    character: "Sailor Moon - Sailor Jupiter",
    image: "/placeholder.svg?height=600&width=400",
    tags: ["Sailor Moon", "Magical Girl"],
    categories: ["Sailor Moon"],
    bio: "Bringing magical girl anime to life with a focus on Sailor Moon characters. Creates handmade accessories and detailed costumes.",
  },
]

const popularCategories = [
  { name: "Demon Slayer", count: 24, slug: "demon-slayer", image: "/placeholder.svg?height=400&width=400" },
  { name: "My Hero Academia", count: 18, slug: "my-hero-academia", image: "/placeholder.svg?height=400&width=400" },
  { name: "Attack on Titan", count: 15, slug: "attack-on-titan", image: "/placeholder.svg?height=400&width=400" },
  { name: "One Piece", count: 22, slug: "one-piece", image: "/placeholder.svg?height=400&width=400" },
]

