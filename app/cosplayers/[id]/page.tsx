"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Instagram, Twitter, Facebook, Youtube, Share2, MessageCircle, ChevronLeft } from "lucide-react"

export default function CosplayerProfile({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the cosplayer data based on the ID
  const cosplayer = cosplayers.find((c) => c.id.toString() === params.id) || cosplayers[0]

  const [isFollowing, setIsFollowing] = useState(false)
  const [likeCount, setLikeCount] = useState(cosplayer.stats.likes)
  const [hasLiked, setHasLiked] = useState(false)

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  const handleLike = () => {
    if (hasLiked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setHasLiked(!hasLiked)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/cosplayers" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Cosplayers
      </Link>

      {/* Profile Header */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-1">
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
            <Image
              src={cosplayer.profileImage || "/placeholder.svg?height=800&width=600"}
              alt={cosplayer.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">{cosplayer.name}</h1>
                  <p className="text-muted-foreground">{cosplayer.location}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleFollow}
                    className={
                      isFollowing ? "bg-muted text-foreground hover:bg-muted/80" : "bg-pink-600 hover:bg-pink-700"
                    }
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                  <Button variant="outline">Message</Button>
                </div>
              </div>

              <div className="flex gap-6 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{cosplayer.stats.posts}</p>
                  <p className="text-sm text-muted-foreground">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{cosplayer.stats.followers}</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{likeCount}</p>
                  <p className="text-sm text-muted-foreground">Likes</p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">About</h2>
                <p className="text-muted-foreground mb-4">{cosplayer.bio}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {cosplayer.specialties.map((specialty, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-purple-100 text-purple-800 hover:bg-purple-200"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Social Media</h2>
                <div className="flex gap-3">
                  <Button variant="outline" size="icon" className="rounded-full text-pink-600">
                    <Instagram className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full text-blue-600">
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full text-blue-800">
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full text-red-600">
                    <Youtube className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className={`gap-2 ${hasLiked ? "text-pink-600" : ""}`}
                onClick={handleLike}
              >
                <Heart className={`h-4 w-4 ${hasLiked ? "fill-pink-600" : ""}`} />
                Like
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Comment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cosplay Gallery Tabs */}
      <Tabs defaultValue="gallery" className="mb-10">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="characters">Characters</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        {/* Gallery Tab */}
        <TabsContent value="gallery" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cosplayer.gallery.map((item, index) => (
              <Link href={`/gallery/${item.id}`} key={index} className="group relative overflow-hidden rounded-lg">
                <Image
                  src={item.image || "/placeholder.svg?height=400&width=300"}
                  alt={item.title}
                  width={300}
                  height={400}
                  className="w-full h-[250px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold">{item.title}</h3>
                  <p className="text-white/80 text-sm">{item.character}</p>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>

        {/* Characters Tab */}
        <TabsContent value="characters" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cosplayer.characters.map((character, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="relative h-[200px]">
                  <Image
                    src={character.image || "/placeholder.svg?height=400&width=300"}
                    alt={character.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold">{character.name}</h3>
                  <p className="text-sm text-muted-foreground">{character.anime}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {character.type}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Tutorials Tab */}
        <TabsContent value="tutorials" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cosplayer.tutorials.map((tutorial, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="relative h-[200px]">
                  <Image
                    src={tutorial.image || "/placeholder.svg?height=400&width=600"}
                    alt={tutorial.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold">{tutorial.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{tutorial.date}</p>
                  <p className="text-sm mb-3">{tutorial.description}</p>
                  <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                    Watch Tutorial
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cosplayer.events.map((event, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex gap-4">
                    <div className="text-center min-w-16">
                      <div className="bg-pink-100 text-pink-800 font-bold py-1 rounded-t-md">{event.month}</div>
                      <div className="bg-white border border-pink-200 text-3xl font-bold py-2 rounded-b-md">
                        {event.day}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{event.location}</p>
                      <p className="text-sm mb-3">{event.role}</p>
                      <Link href={`/events/${event.id}`}>
                        <Button size="sm" variant="outline">
                          Event Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Similar Cosplayers */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Similar Cosplayers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {similarCosplayers.map((cosplayer, index) => (
            <Link href={`/cosplayers/${cosplayer.id}`} key={index} className="group">
              <div className="relative rounded-full overflow-hidden w-32 h-32 mx-auto mb-3">
                <Image
                  src={cosplayer.image || "/placeholder.svg?height=200&width=200"}
                  alt={cosplayer.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="text-center">
                <h3 className="font-bold group-hover:text-pink-600 transition-colors">{cosplayer.name}</h3>
                <p className="text-sm text-muted-foreground">{cosplayer.specialty}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// Sample data
const cosplayers = [
  {
    id: 1,
    name: "Sakura Cosplay",
    location: "Tokyo, Japan",
    profileImage: "/placeholder.svg?height=800&width=600",
    bio: "Professional cosplayer specializing in Demon Slayer characters. Award-winning costume designer with 5+ years of experience. I love bringing anime characters to life through detailed costume work and makeup techniques.",
    specialties: ["Costume Design", "Prop Making", "Makeup", "Wig Styling"],
    stats: {
      posts: 127,
      followers: 45600,
      likes: 892300,
    },
    gallery: [
      { id: 1, title: "Nezuko Battle Pose", character: "Demon Slayer", image: "/placeholder.svg?height=400&width=300" },
      {
        id: 2,
        title: "Nezuko Transformation",
        character: "Demon Slayer",
        image: "/placeholder.svg?height=400&width=300",
      },
      { id: 3, title: "Mitsuri Kanroji", character: "Demon Slayer", image: "/placeholder.svg?height=400&width=300" },
      { id: 4, title: "Shinobu Kocho", character: "Demon Slayer", image: "/placeholder.svg?height=400&width=300" },
      { id: 5, title: "Kanao Tsuyuri", character: "Demon Slayer", image: "/placeholder.svg?height=400&width=300" },
      { id: 6, title: "Daki", character: "Demon Slayer", image: "/placeholder.svg?height=400&width=300" },
      { id: 7, title: "Makomo", character: "Demon Slayer", image: "/placeholder.svg?height=400&width=300" },
      { id: 8, title: "Tamayo", character: "Demon Slayer", image: "/placeholder.svg?height=400&width=300" },
    ],
    characters: [
      { name: "Nezuko Kamado", anime: "Demon Slayer", type: "Demon", image: "/placeholder.svg?height=400&width=300" },
      {
        name: "Mitsuri Kanroji",
        anime: "Demon Slayer",
        type: "Hashira",
        image: "/placeholder.svg?height=400&width=300",
      },
      { name: "Shinobu Kocho", anime: "Demon Slayer", type: "Hashira", image: "/placeholder.svg?height=400&width=300" },
      {
        name: "Kanao Tsuyuri",
        anime: "Demon Slayer",
        type: "Demon Slayer",
        image: "/placeholder.svg?height=400&width=300",
      },
    ],
    tutorials: [
      {
        title: "Creating Nezuko's Bamboo Muzzle",
        date: "May 15, 2023",
        description:
          "Learn how to create a screen-accurate bamboo muzzle for your Nezuko cosplay using affordable materials.",
        image: "/placeholder.svg?height=400&width=600",
      },
      {
        title: "Demon Slayer Eye Makeup Tutorial",
        date: "April 3, 2023",
        description:
          "Master the unique eye designs for various Demon Slayer characters with this step-by-step makeup guide.",
        image: "/placeholder.svg?height=400&width=600",
      },
    ],
    events: [
      { id: 1, title: "Anime Expo 2023", location: "Los Angeles, CA", role: "Guest Cosplayer", month: "JUL", day: "4" },
      {
        id: 2,
        title: "Tokyo Comic Con",
        location: "Tokyo, Japan",
        role: "Cosplay Competition Judge",
        month: "DEC",
        day: "12",
      },
      {
        id: 3,
        title: "Demon Slayer Fan Meet",
        location: "Osaka, Japan",
        role: "Featured Cosplayer",
        month: "SEP",
        day: "23",
      },
    ],
  },
  {
    id: 2,
    name: "Hiroshi Designs",
    location: "Osaka, Japan",
    profileImage: "/placeholder.svg?height=800&width=600",
    bio: "Passionate about bringing My Hero Academia characters to life. Specializes in creating detailed hero costumes and props. I focus on creating screen-accurate costumes with functional elements.",
    specialties: ["Hero Costumes", "Armor Making", "LED Work", "3D Printing"],
    stats: {
      posts: 89,
      followers: 32400,
      likes: 567800,
    },
    gallery: [
      {
        id: 9,
        title: "Deku Hero Costume",
        character: "My Hero Academia",
        image: "/placeholder.svg?height=400&width=300",
      },
      {
        id: 10,
        title: "Deku Full Cowling",
        character: "My Hero Academia",
        image: "/placeholder.svg?height=400&width=300",
      },
      { id: 11, title: "All Might", character: "My Hero Academia", image: "/placeholder.svg?height=400&width=300" },
      { id: 12, title: "Bakugo", character: "My Hero Academia", image: "/placeholder.svg?height=400&width=300" },
      { id: 13, title: "Todoroki", character: "My Hero Academia", image: "/placeholder.svg?height=400&width=300" },
      { id: 14, title: "Endeavor", character: "My Hero Academia", image: "/placeholder.svg?height=400&width=300" },
      { id: 15, title: "Hawks", character: "My Hero Academia", image: "/placeholder.svg?height=400&width=300" },
      { id: 16, title: "Lemillion", character: "My Hero Academia", image: "/placeholder.svg?height=400&width=300" },
    ],
    characters: [
      {
        name: "Izuku Midoriya",
        anime: "My Hero Academia",
        type: "Hero",
        image: "/placeholder.svg?height=400&width=300",
      },
      {
        name: "All Might",
        anime: "My Hero Academia",
        type: "Pro Hero",
        image: "/placeholder.svg?height=400&width=300",
      },
      {
        name: "Katsuki Bakugo",
        anime: "My Hero Academia",
        type: "Hero",
        image: "/placeholder.svg?height=400&width=300",
      },
      {
        name: "Shoto Todoroki",
        anime: "My Hero Academia",
        type: "Hero",
        image: "/placeholder.svg?height=400&width=300",
      },
    ],
    tutorials: [
      {
        title: "Creating Deku's Glowing Full Cowling Effect",
        date: "June 22, 2023",
        description: "Learn how to create glowing effects for your Deku cosplay using LEDs and translucent materials.",
        image: "/placeholder.svg?height=400&width=600",
      },
      {
        title: "3D Printing Hero Costume Accessories",
        date: "March 15, 2023",
        description: "A beginner's guide to 3D printing accessories for your My Hero Academia cosplays.",
        image: "/placeholder.svg?height=400&width=600",
      },
    ],
    events: [
      { id: 4, title: "Hero Con 2023", location: "New York, NY", role: "Cosplay Guest", month: "AUG", day: "15" },
      { id: 5, title: "Anime NYC", location: "New York, NY", role: "Panelist", month: "NOV", day: "18" },
      {
        id: 6,
        title: "My Hero Academia Gathering",
        location: "Tokyo, Japan",
        role: "Organizer",
        month: "OCT",
        day: "7",
      },
    ],
  },
]

const similarCosplayers = [
  { id: 3, name: "Anime Artisan", specialty: "Attack on Titan", image: "/placeholder.svg?height=200&width=200" },
  { id: 4, name: "Cosplay King", specialty: "One Piece", image: "/placeholder.svg?height=200&width=200" },
  { id: 5, name: "Fantasy Forge", specialty: "Naruto", image: "/placeholder.svg?height=200&width=200" },
  { id: 6, name: "Anime Alchemist", specialty: "Fullmetal Alchemist", image: "/placeholder.svg?height=200&width=200" },
]

