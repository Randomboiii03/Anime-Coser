import { supabase } from "@/lib/supabase"
import { cache } from "react"

export type GalleryItem = {
  id: number
  title: string
  cosplayerId: number
  cosplayerName: string
  imagePath: string
  imageUrl: string
  tags: string[]
  likes: number
  featured: boolean
  description: string | null
  createdAt: string
  updatedAt: string
}

// Transform database gallery item to frontend gallery item
function transformGalleryItem(item: any, cosplayerName?: string): GalleryItem {
  return {
    id: item.id,
    title: item.title,
    cosplayerId: item.cosplayer_id,
    cosplayerName: cosplayerName || "Unknown Cosplayer",
    imagePath: item.image_path,
    imageUrl: item.image_path
      ? item.image_path.startsWith("http")
        ? item.image_path
        : `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(item.title || "Gallery Image")}`
      : "/placeholder.svg?height=400&width=300",
    tags: item.tags || [],
    likes: item.likes || 0,
    featured: item.featured || false,
    description: item.description,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }
}

// Get all gallery items with caching
export const getGalleryItems = cache(async (): Promise<GalleryItem[]> => {
  const { data, error } = await supabase
    .from("gallery")
    .select(`
      *,
      cosplayers(name)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching gallery items:", error)
    return []
  }

  return data.map((item) => transformGalleryItem(item, item.cosplayers?.name))
})

// Get featured gallery items with caching
export const getFeaturedGalleryItems = cache(async (): Promise<GalleryItem[]> => {
  const { data, error } = await supabase
    .from("gallery")
    .select(`
      *,
      cosplayers(name)
    `)
    .eq("featured", true)
    .order("likes", { ascending: false })
    .limit(12)

  if (error) {
    console.error("Error fetching featured gallery items:", error)
    return []
  }

  return data.map((item) => transformGalleryItem(item, item.cosplayers?.name))
})

// Get gallery item by ID with caching
export const getGalleryItemById = cache(async (id: number): Promise<GalleryItem | null> => {
  const { data, error } = await supabase
    .from("gallery")
    .select(`
      *,
      cosplayers(name)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching gallery item with ID ${id}:`, error)
    return null
  }

  return transformGalleryItem(data, data.cosplayers?.name)
})

// Get gallery items by cosplayer ID with caching
export const getGalleryItemsByCosplayerId = cache(async (cosplayerId: number): Promise<GalleryItem[]> => {
  const { data, error } = await supabase
    .from("gallery")
    .select(`
      *,
      cosplayers(name)
    `)
    .eq("cosplayer_id", cosplayerId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(`Error fetching gallery items for cosplayer ID ${cosplayerId}:`, error)
    return []
  }

  return data.map((item) => transformGalleryItem(item, item.cosplayers?.name))
})

// Get gallery items by tag with caching
export const getGalleryItemsByTag = cache(async (tag: string): Promise<GalleryItem[]> => {
  const { data, error } = await supabase
    .from("gallery")
    .select(`
      *,
      cosplayers(name)
    `)
    .contains("tags", [tag])
    .order("created_at", { ascending: false })

  if (error) {
    console.error(`Error fetching gallery items with tag ${tag}:`, error)
    return []
  }

  return data.map((item) => transformGalleryItem(item, item.cosplayers?.name))
})

