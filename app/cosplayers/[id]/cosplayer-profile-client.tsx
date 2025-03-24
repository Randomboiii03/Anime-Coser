"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Instagram, Twitter, Facebook, Youtube, Share2, MessageCircle, ChevronLeft } from "lucide-react"
import type { Cosplayer } from "@/lib/api/cosplayers"
import type { GalleryItem } from "@/lib/api/gallery"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export default function CosplayerProfileClient({
  cosplayer,
  galleryItems,
}: {
  cosplayer: Cosplayer
  galleryItems: GalleryItem[]
}) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [likeCount, setLikeCount] = useState(cosplayer.popularity)
  const [hasLiked, setHasLiked] = useState(false)
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)

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

  const openGalleryItem = (item: GalleryItem) => {
    setSelectedImage(item)
  }

  const closeGalleryItem = () => {
    setSelectedImage(null)
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
              src={cosplayer.profileImage || "/placeholder.svg"}
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
                  <p className="text-muted-foreground">{cosplayer.location || "Location not specified"}</p>
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
                  <p className="text-2xl font-bold">{galleryItems.length}</p>
                  <p className="text-sm text-muted-foreground">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{Math.floor(cosplayer.popularity / 10)}</p>
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
                  {cosplayer.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-purple-100 text-purple-800 hover:bg-purple-200"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Social Media</h2>
                <div className="flex gap-3">
                  {cosplayer.socialLinks?.instagram && (
                    <Button variant="outline" size="icon" className="rounded-full text-pink-600">
                      <Instagram className="h-5 w-5" />
                    </Button>
                  )}
                  {cosplayer.socialLinks?.twitter && (
                    <Button variant="outline" size="icon" className="rounded-full text-blue-600">
                      <Twitter className="h-5 w-5" />
                    </Button>
                  )}
                  {cosplayer.socialLinks?.facebook && (
                    <Button variant="outline" size="icon" className="rounded-full text-blue-800">
                      <Facebook className="h-5 w-5" />
                    </Button>
                  )}
                  {cosplayer.socialLinks?.youtube && (
                    <Button variant="outline" size="icon" className="rounded-full text-red-600">
                      <Youtube className="h-5 w-5" />
                    </Button>
                  )}
                  {!cosplayer.socialLinks?.instagram &&
                    !cosplayer.socialLinks?.twitter &&
                    !cosplayer.socialLinks?.facebook &&
                    !cosplayer.socialLinks?.youtube && (
                      <p className="text-muted-foreground">No social media links available</p>
                    )}
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
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="characters">Characters</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        {/* Gallery Tab */}
        <TabsContent value="gallery" className="mt-6">
          {galleryItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No gallery items available for this cosplayer.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-lg cursor-pointer"
                  onClick={() => openGalleryItem(item)}
                >
                  <Image
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.title}
                    width={300}
                    height={400}
                    className="w-full h-[250px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white font-bold">{item.title}</h3>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {item.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="border-white/30 text-white">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Characters Tab */}
        <TabsContent value="characters" className="mt-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Character information coming soon.</p>
          </div>
        </TabsContent>

        {/* Tutorials Tab */}
        <TabsContent value="tutorials" className="mt-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Tutorials coming soon.</p>
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="mt-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Events information coming soon.</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Fullscreen Image Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && closeGalleryItem()}>
        <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 overflow-hidden">
          {selectedImage && (
            <div className="relative h-full flex flex-col">
              {/* Image */}
              <div className="flex-grow flex items-center justify-center bg-black">
                <div className="relative w-full h-full">
                  <Image
                    src={selectedImage.imageUrl || "/placeholder.svg"}
                    alt={selectedImage.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Image info */}
              <div className="bg-black text-white p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold">{selectedImage.title}</h2>
                    <p className="text-white/80">by {cosplayer.name}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="ghost" size="icon" className="text-white">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white">
                      <MessageCircle className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {selectedImage.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="border-white/30 text-white">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

