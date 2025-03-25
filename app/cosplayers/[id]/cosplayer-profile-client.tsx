"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlaceholderImage } from "@/components/placeholder-image"

export type Cosplayer = {
  id: number
  name: string
  profileImage: string
  bio: string
  specialty: string
  socialLinks: {
    instagram?: string
    twitter?: string
    tiktok?: string
  }
  popularity: number
  gallery: {
    id: number
    title: string
    imageUrl: string
  }[]
}

interface CosplayerProfileClientProps {
  cosplayer: Cosplayer
}

export function CosplayerProfileClient({ cosplayer }: CosplayerProfileClientProps) {
  const [popularity, setPopularity] = useState(cosplayer.popularity)
  const [hasLiked, setHasLiked] = useState(false)

  const handleLike = async () => {
    if (hasLiked) return

    try {
      const response = await fetch(`/api/likes?type=cosplayer&id=${cosplayer.id}`, {
        method: "POST",
      })

      if (response.ok) {
        setPopularity((prev) => prev + 1)
        setHasLiked(true)
      }
    } catch (error) {
      console.error("Error liking cosplayer:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="aspect-square relative rounded-md overflow-hidden mb-6">
                {cosplayer.profileImage ? (
                  <Image
                    src={cosplayer.profileImage || "/placeholder.svg"}
                    alt={cosplayer.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <PlaceholderImage
                    width={400}
                    height={400}
                    text={cosplayer.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <h1 className="text-2xl font-bold mb-2">{cosplayer.name}</h1>
              <p className="text-muted-foreground mb-4">{cosplayer.specialty}</p>

              <div className="flex items-center gap-2 mb-6">
                <Button variant={hasLiked ? "default" : "outline"} size="sm" onClick={handleLike} disabled={hasLiked}>
                  {hasLiked ? "Liked" : "Like"}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {popularity} {popularity === 1 ? "fan" : "fans"}
                </span>
              </div>

              {/* Social Links */}
              {Object.entries(cosplayer.socialLinks).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-2">Follow</h3>
                  <div className="flex gap-2">
                    {cosplayer.socialLinks.instagram && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={cosplayer.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-instagram"
                          >
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                          </svg>
                        </a>
                      </Button>
                    )}
                    {cosplayer.socialLinks.twitter && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={cosplayer.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-twitter"
                          >
                            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                          </svg>
                        </a>
                      </Button>
                    )}
                    {cosplayer.socialLinks.tiktok && (
                      <Button variant="outline" size="icon" asChild>
                        <a href={cosplayer.socialLinks.tiktok} target="_blank" rel="noopener noreferrer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-music"
                          >
                            <path d="M9 18V5l12-2v13" />
                            <circle cx="6" cy="18" r="3" />
                            <circle cx="18" cy="16" r="3" />
                          </svg>
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="about">
            <TabsList className="mb-6">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>

            <TabsContent value="about">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">About {cosplayer.name}</h2>
                  <div className="prose max-w-none dark:prose-invert">
                    <p>{cosplayer.bio}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cosplayer.gallery.length > 0 ? (
                  cosplayer.gallery.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="aspect-[4/3] relative">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl || "/placeholder.svg"}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <PlaceholderImage
                            width={400}
                            height={300}
                            text={item.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium">{item.title}</h3>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No gallery items yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

