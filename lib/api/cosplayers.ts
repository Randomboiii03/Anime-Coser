import { supabase } from "@/lib/supabase"
import { cache } from "react"

export type Cosplayer = {
  id: number
  name: string
  character: string
  series: string
  bio: string
  profileImage: string
  bannerImage: string | null
  tags: string[]
  socialLinks: {
    instagram?: string
    twitter?: string
    facebook?: string
    youtube?: string
  }
  popularity: number
  featured: boolean
  location: string | null
  createdAt: string
  updatedAt: string
}

// Transform database cosplayer to frontend cosplayer
function transformCosplayer(cosplayer: any): Cosplayer {
  return {
    id: cosplayer.id,
    name: cosplayer.name,
    character: cosplayer.character,
    series: cosplayer.series,
    bio: cosplayer.bio || "",
    profileImage: cosplayer.profile_image
      ? cosplayer.profile_image.startsWith("http")
        ? cosplayer.profile_image
        : `/placeholder.svg?height=600&width=400&text=${encodeURIComponent(cosplayer.name || "Cosplayer")}`
      : "/placeholder.svg?height=600&width=400",
    bannerImage: cosplayer.banner_image
      ? cosplayer.banner_image.startsWith("http")
        ? cosplayer.banner_image
        : `/placeholder.svg?height=400&width=1200&text=${encodeURIComponent(cosplayer.name || "Cosplayer Banner")}`
      : null,
    tags: cosplayer.tags || [],
    socialLinks: cosplayer.social_links || {},
    popularity: cosplayer.popularity || 0,
    featured: cosplayer.featured || false,
    location: cosplayer.location,
    createdAt: cosplayer.created_at,
    updatedAt: cosplayer.updated_at,
  }
}

// Get all cosplayers with caching
export const getCosplayers = cache(async (): Promise<Cosplayer[]> => {
  const { data, error } = await supabase.from("cosplayers").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching cosplayers:", error)
    return []
  }

  return data.map(transformCosplayer)
})

// Get featured cosplayers with caching
export const getFeaturedCosplayers = cache(async (): Promise<Cosplayer[]> => {
  const { data, error } = await supabase
    .from("cosplayers")
    .select("*")
    .eq("featured", true)
    .order("popularity", { ascending: false })
    .limit(6)

  if (error) {
    console.error("Error fetching featured cosplayers:", error)
    return []
  }

  return data.map(transformCosplayer)
})

// Get cosplayer by ID with caching
export const getCosplayerById = cache(async (id: number): Promise<Cosplayer | null> => {
  const { data, error } = await supabase.from("cosplayers").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching cosplayer with ID ${id}:`, error)
    return null
  }

  return transformCosplayer(data)
})

