import { getCosplayerById } from "@/lib/api/cosplayers"
import { getGalleryItemsByCosplayerId } from "@/lib/api/gallery"
import CosplayerProfileClient from "./cosplayer-profile-client"
import { notFound } from "next/navigation"

export const revalidate = 3600 // Revalidate every hour

export default async function CosplayerProfile({ params }: { params: { id: string } }) {
  const cosplayerId = Number.parseInt(params.id)

  if (isNaN(cosplayerId)) {
    notFound()
  }

  const [cosplayer, galleryItems] = await Promise.all([
    getCosplayerById(cosplayerId),
    getGalleryItemsByCosplayerId(cosplayerId),
  ])

  if (!cosplayer) {
    notFound()
  }

  return <CosplayerProfileClient cosplayer={cosplayer} galleryItems={galleryItems} />
}

