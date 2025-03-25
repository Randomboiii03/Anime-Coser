import { getGalleryItemById, getGalleryItems } from "@/lib/api/gallery"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, Heart, MessageCircle, Share2 } from "lucide-react"

export const revalidate = 3600 // Revalidate every hour

export default async function GalleryItemPage({ params }: { params: { id: string } }) {
  const galleryItemId = Number.parseInt(params.id)

  if (isNaN(galleryItemId)) {
    notFound()
  }

  const galleryItem = await getGalleryItemById(galleryItemId)

  if (!galleryItem) {
    notFound()
  }

  // Get related items (same tags or same cosplayer)
  const allItems = await getGalleryItems()
  const relatedItems = allItems
    .filter(
      (item) =>
        item.id !== galleryItem.id &&
        (item.cosplayerId === galleryItem.cosplayerId || item.tags.some((tag) => galleryItem.tags.includes(tag))),
    )
    .slice(0, 6)

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
            src={galleryItem.imageUrl || "/placeholder.svg"}
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
              <AvatarImage src="/placeholder-user.jpg" alt={galleryItem.cosplayerName} />
              <AvatarFallback>{galleryItem.cosplayerName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <Link href={`/cosplayers/${galleryItem.cosplayerId}`} className="font-medium hover:text-pink-600">
                {galleryItem.cosplayerName}
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
                <p className="font-medium">{galleryItem.tags[0] || "Anime"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cosplayer</p>
                <p className="font-medium">{galleryItem.cosplayerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date Added</p>
                <p className="font-medium">{new Date(galleryItem.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" className="gap-2">
              <Heart className="h-4 w-4" />
              {galleryItem.likes} Likes
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
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-2 w-full">
                    <h3 className="text-white text-sm font-bold truncate">{item.title}</h3>
                    <p className="text-white/80 text-xs truncate">{item.cosplayerName}</p>
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

