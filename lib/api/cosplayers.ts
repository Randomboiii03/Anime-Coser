import { supabase, getImageUrl } from "@/lib/supabase"
import { cache } from "react"

export type Cosplayer = {
  id: number
  name: string
  character: string
  bio: string
  location: string | null
  profileImage: string
  tags: string[]
  popularity: number
  status: "active" | "inactive" | "pending"
  featured: boolean
  socialLinks: {
    instagram?: string
    twitter?: string
    facebook?: string
    youtube?: string
    website?: string
  } | null
  createdAt: string
  updatedAt: string
}

// Transform database cosplayer to frontend cosplayer
function transformCosplayer(cosplayer: any): Cosplayer {
  return {
    id: cosplayer.id,
    name: cosplayer.name,
    character: cosplayer.character,
    bio: cosplayer.bio,
    location: cosplayer.location,
    profileImage: cosplayer.profile_image
      ? getImageUrl("cosplayers", cosplayer.profile_image)
      : "/placeholder.svg?height=600&width=400",
    tags: cosplayer.tags || [],
    popularity: cosplayer.popularity || 0,
    status: cosplayer.status || "active",
    featured: cosplayer.featured || false,
    socialLinks: cosplayer.social_links || null,
    createdAt: cosplayer.created_at,
    updatedAt: cosplayer.updated_at,
  }
}

// Get all cosplayers with caching
export const getCosplayers = cache(async (): Promise<Cosplayer[]> => {
  const { data, error } = await supabase.from("cosplayers").select("*").order("created_at", { ascending: false })

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
    .eq("status", "active")
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

// Get cosplayers by category with caching
export const getCosplayersByCategory = cache(async (category: string): Promise<Cosplayer[]> => {
  const { data, error } = await supabase
    .from("cosplayers")
    .select("*")
    .contains("tags", [category])
    .eq("status", "active")
    .order("popularity", { ascending: false })

  if (error) {
    console.error(`Error fetching cosplayers with category ${category}:`, error)
    return []
  }

  return data.map(transformCosplayer)
})

// Create a new cosplayer
export async function createCosplayer(
  cosplayer: Omit<Cosplayer, "id" | "createdAt" | "updatedAt">,
): Promise<number | null> {
  const { data, error } = await supabase
    .from("cosplayers")
    .insert({
      name: cosplayer.name,
      character: cosplayer.character,
      bio: cosplayer.bio,
      location: cosplayer.location,
      profile_image: cosplayer.profileImage.includes("placeholder.svg") ? null : cosplayer.profileImage,
      tags: cosplayer.tags,
      popularity: cosplayer.popularity,
      status: cosplayer.status,
      featured: cosplayer.featured,
      social_links: cosplayer.socialLinks,
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error creating cosplayer:", error)
    return null
  }

  return data.id
}

// Update an existing cosplayer
export async function updateCosplayer(
  id: number,
  cosplayer: Partial<Omit<Cosplayer, "id" | "createdAt" | "updatedAt">>,
): Promise<boolean> {
  const updateData: any = {}

  if (cosplayer.name !== undefined) updateData.name = cosplayer.name
  if (cosplayer.character !== undefined) updateData.character = cosplayer.character
  if (cosplayer.bio !== undefined) updateData.bio = cosplayer.bio
  if (cosplayer.location !== undefined) updateData.location = cosplayer.location
  if (cosplayer.profileImage !== undefined) {
    updateData.profile_image = cosplayer.profileImage.includes("placeholder.svg") ? null : cosplayer.profileImage
  }
  if (cosplayer.tags !== undefined) updateData.tags = cosplayer.tags
  if (cosplayer.popularity !== undefined) updateData.popularity = cosplayer.popularity
  if (cosplayer.status !== undefined) updateData.status = cosplayer.status
  if (cosplayer.featured !== undefined) updateData.featured = cosplayer.featured
  if (cosplayer.socialLinks !== undefined) updateData.social_links = cosplayer.socialLinks

  const { error } = await supabase.from("cosplayers").update(updateData).eq("id", id)

  if (error) {
    console.error(`Error updating cosplayer with ID ${id}:`, error)
    return false
  }

  return true
}

// Delete a cosplayer
export async function deleteCosplayer(id: number): Promise<boolean> {
  const { error } = await supabase.from("cosplayers").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting cosplayer with ID ${id}:`, error)
    return false
  }

  return true
}

