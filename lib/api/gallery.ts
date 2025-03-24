import { supabase, getImageUrl } from "@/lib/supabase"
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
    imageUrl: getImageUrl("gallery", item.image_path),
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
      cosplayers:cosplayer_id (name)
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
      cosplayers:cosplayer_id (name)
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
      cosplayers:cosplayer_id (name)
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
      cosplayers:cosplayer_id (name)
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
      cosplayers:cosplayer_id (name)
    `)
    .contains("tags", [tag])
    .order("created_at", { ascending: false })

  if (error) {
    console.error(`Error fetching gallery items with tag ${tag}:`, error)
    return []
  }

  return data.map((item) => transformGalleryItem(item, item.cosplayers?.name))
})

// Create a new gallery item
export async function createGalleryItem(
  item: Omit<GalleryItem, "id" | "cosplayerName" | "imageUrl" | "createdAt" | "updatedAt">,
): Promise<number | null> {
  const { data, error } = await supabase
    .from("gallery")
    .insert({
      title: item.title,
      cosplayer_id: item.cosplayerId,
      image_path: item.imagePath,
      tags: item.tags,
      likes: item.likes,
      featured: item.featured,
      description: item.description,
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error creating gallery item:", error)
    return null
  }

  return data.id
}

// Update an existing gallery item
export async function updateGalleryItem(
  id: number,
  item: Partial<Omit<GalleryItem, "id" | "cosplayerName" | "imageUrl" | "createdAt" | "updatedAt">>,
): Promise<boolean> {
  const updateData: any = {}

  if (item.title !== undefined) updateData.title = item.title
  if (item.cosplayerId !== undefined) updateData.cosplayer_id = item.cosplayerId
  if (item.imagePath !== undefined) updateData.image_path = item.imagePath
  if (item.tags !== undefined) updateData.tags = item.tags
  if (item.likes !== undefined) updateData.likes = item.likes
  if (item.featured !== undefined) updateData.featured = item.featured
  if (item.description !== undefined) updateData.description = item.description

  const { error } = await supabase.from("gallery").update(updateData).eq("id", id)

  if (error) {
    console.error(`Error updating gallery item with ID ${id}:`, error)
    return false
  }

  return true
}

// Delete a gallery item
export async function deleteGalleryItem(id: number): Promise<boolean> {
  const { error } = await supabase.from("gallery").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting gallery item with ID ${id}:`, error)
    return false
  }

  return true
}

// Increment likes for a gallery item
export async function incrementGalleryItemLikes(id: number): Promise<boolean> {
  const { error } = await supabase.rpc("increment_gallery_likes", { item_id: id })

  if (error) {
    console.error(`Error incrementing likes for gallery item with ID ${id}:`, error)
    return false
  }

  return true
}

