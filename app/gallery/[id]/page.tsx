"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, Heart, MessageCircle, Share2 } from "lucide-react"

export default function GalleryItemPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the gallery item data based on the ID
  const [galleryItem, setGalleryItem] = useState<(typeof galleryItems)[0] | null>(null)
  const [relatedItems, setRelatedItems] = useState<typeof galleryItems>([])
  const [hasLiked, setHasLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    // Find the gallery item by ID
    const item = galleryItems.find((item) => item.id.toString() === params.id)

    if (item) {
      setGalleryItem(item)
      setLikeCount(item.likes)

      // Find related items (same tags or same cosplayer)
      const related = galleryItems
        .filter(
          (relatedItem) =>
            relatedItem.id !== item.id &&
            (relatedItem.cosplayer === item.cosplayer || relatedItem.tags.some((tag) => item.tags.includes(tag))),
        )
        .slice(0, 6)

      setRelatedItems(related)
    }
  }, [params.id])

  const handleLike = () => {
    if (hasLiked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setHasLiked(!hasLiked)
  }

  if (!galleryItem) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading gallery item...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/gallery" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Gallery
      </Link>

      {/* Gallery Item */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="relative rounded-lg overflow-hidden aspect-[3/4]">
          <Image
            src={galleryItem.image || "/placeholder.svg?height=800&width=600"}
            alt={galleryItem.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{galleryItem.title}</h1>

          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder-user.jpg" alt={galleryItem.cosplayer} />
              <AvatarFallback>{galleryItem.cosplayer[0]}</AvatarFallback>
            </Avatar>
            <div>
              <Link href={`/cosplayers/${galleryItem.cosplayerId || 1}`} className="font-medium hover:text-pink-600">
                {galleryItem.cosplayer}
              </Link>
              <p className="text-sm text-muted-foreground">Cosplayer</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {galleryItem.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2">About this Cosplay</h2>
            <p className="text-muted-foreground mb-4">
              {galleryItem.description ||
                `This stunning ${galleryItem.title} cosplay brings the character to life with incredible attention to detail. 
                From the costume to the makeup and props, every element has been carefully crafted to create an authentic representation.`}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Character</p>
                <p className="font-medium">{galleryItem.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Series</p>
                <p className="font-medium">{galleryItem.tags[0]}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Photographer</p>
                <p className="font-medium">{galleryItem.photographer || "AnimeCosu Studios"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date Added</p>
                <p className="font-medium">{galleryItem.dateAdded || "May 15, 2023"}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" className={`gap-2 ${hasLiked ? "text-pink-600" : ""}`} onClick={handleLike}>
              <Heart className={`h-4 w-4 ${hasLiked ? "fill-pink-600" : ""}`} />
              {likeCount} Likes
            </Button>
            <Button variant="outline" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Comments
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Related Gallery Items */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">More Like This</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {relatedItems.map((item) => (
            <Link href={`/gallery/${item.id}`} key={item.id} className="group">
              <div className="relative rounded-lg overflow-hidden aspect-square">
                <Image
                  src={item.image || "/placeholder.svg?height=300&width=300"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-2 w-full">
                    <h3 className="text-white text-sm font-bold truncate">{item.title}</h3>
                    <p className="text-white/80 text-xs truncate">{item.cosplayer}</p>
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

// Sample data
const galleryItems = [
  {
    id: 1,
    title: "Nezuko Kamado",
    cosplayer: "Sakura Cosplay",
    cosplayerId: 1,
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Demon Slayer", "Nezuko"],
    likes: 1245,
    photographer: "Anime Lens",
    dateAdded: "May 15, 2023",
    description:
      "This Nezuko Kamado cosplay features a handmade bamboo muzzle and detailed kimono. The wig was styled to perfectly match Nezuko's gradient hair color, and the costume includes authentic-looking blood demon art effects.",
  },
  {
    id: 2,
    title: "Deku Hero Costume",
    cosplayer: "Hiroshi Designs",
    cosplayerId: 2,
    image: "/placeholder.svg?height=400&width=300",
    tags: ["My Hero Academia", "Deku"],
    likes: 982,
    photographer: "Hero Shots",
    dateAdded: "April 28, 2023",
    description:
      "My Deku cosplay features a screen-accurate hero costume with functional arm bracers and reinforced gloves. The costume was made with breathable materials to allow for dynamic action poses and movement.",
  },
  {
    id: 3,
    title: "Mikasa Ackerman",
    cosplayer: "Anime Artisan",
    cosplayerId: 3,
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Attack on Titan", "Mikasa"],
    likes: 876,
    photographer: "Titan Photography",
    dateAdded: "June 10, 2023",
    description:
      "This Mikasa Ackerman cosplay features a handmade Survey Corps uniform with authentic embroidered patches. The 3D maneuver gear was crafted from EVA foam and PVC with metal details for a realistic look.",
  },
  {
    id: 4,
    title: "Monkey D. Luffy",
    cosplayer: "Cosplay King",
    cosplayerId: 4,
    image: "/placeholder.svg?height=400&width=300",
    tags: ["One Piece", "Luffy"],
    likes: 1102,
    photographer: "Grand Line Studios",
    dateAdded: "March 5, 2023",
    description:
      "My Luffy cosplay captures his carefree spirit with a custom-made straw hat and detailed vest. The scar under the eye is created with special effects makeup for a realistic appearance.",
  },
  {
    id: 5,
    title: "Kakashi Hatake",
    cosplayer: "Fantasy Forge",
    cosplayerId: 5,
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Naruto", "Kakashi"],
    likes: 934,
    photographer: "Ninja Snapshots",
    dateAdded: "February 15, 2023",
    description:
      "This Kakashi cosplay features a handmade Konoha headband and custom-tailored jounin vest. The Sharingan eye effect was created using a specialized contact lens for authentic detail.",
  },
  {
    id: 6,
    title: "Edward Elric",
    cosplayer: "Anime Alchemist",
    cosplayerId: 6,
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Fullmetal Alchemist", "Edward"],
    likes: 756,
    photographer: "Alchemy Studios",
    dateAdded: "January 20, 2023",
    description:
      "My Edward Elric cosplay features a handcrafted automail arm made from EVA foam and metallic paint. The red coat was custom dyed and weathered to match the anime's aesthetic.",
  },
  {
    id: 7,
    title: "Asuka Langley",
    cosplayer: "Mecha Master",
    cosplayerId: 7,
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Evangelion", "Asuka"],
    likes: 689,
    photographer: "NERV Photography",
    dateAdded: "July 1, 2023",
    description:
      "This Asuka plugsuit was created using a custom-printed fabric with detailed panel lines. The neural connectors were 3D printed and hand-painted for screen accuracy.",
  },
  {
    id: 8,
    title: "Sailor Jupiter",
    cosplayer: "Magical Cosplay",
    cosplayerId: 8,
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Sailor Moon", "Jupiter"],
    likes: 723,
    photographer: "Moon Kingdom Photos",
    dateAdded: "June 25, 2023",
    description:
      "My Sailor Jupiter cosplay features a handmade sailor uniform with custom embroidered details. The boots were modified from existing shoes and painted to match the character's iconic look.",
  },
  {
    id: 9,
    title: "Tanjiro Kamado",
    cosplayer: "Blade Cosplay",
    cosplayerId: 9,
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Demon Slayer", "Tanjiro"],
    likes: 1056,
    photographer: "Anime Lens",
    dateAdded: "May 30, 2023",
    description:
      "This Tanjiro cosplay features a handmade Nichirin Blade and detailed Demon Slayer uniform. The scar was created using special effects makeup, and the earrings were handcrafted from polymer clay.",
  },
  {
    id: 10,
    title: "Bakugo Katsuki",
    cosplayer: "Explosion Cosplay",
    cosplayerId: 10,
    image: "/placeholder.svg?height=400&width=300",
    tags: ["My Hero Academia", "Bakugo"],
    likes: 945,
    photographer: "Hero Shots",
    dateAdded: "April 15, 2023",
    description:
      "My Bakugo cosplay features functional gauntlets with LED effects to simulate explosions. The hero costume was created with durable materials to withstand dynamic action poses.",
  },
  {
    id: 11,
    title: "Levi Ackerman",
    cosplayer: "Scout Regiment",
    cosplayerId: 11,
    image: "/placeholder.svg?height=400&width=300",
    tags: ["Attack on Titan", "Levi"],
    likes: 1320,
    photographer: "Titan Photography",
    dateAdded: "March 20, 2023",
    description:
      "This Levi cosplay features a custom-tailored Survey Corps uniform with authentic embroidered patches. The 3D maneuver gear includes functional spinning mechanisms for the blades.",
  },
  {
    id: 12,
    title: "Nico Robin",
    cosplayer: "Pirate Queen",
    cosplayerId: 12,
    image: "/placeholder.svg?height=400&width=300",
    tags: ["One Piece", "Robin"],
    likes: 867,
    photographer: "Grand Line Studios",
    dateAdded: "February 10, 2023",
    description:
      "My Nico Robin cosplay captures her post-timeskip look with a custom-made outfit and styled wig. The sunglasses were modified from an existing pair to match Robin's iconic style.",
  },
]

