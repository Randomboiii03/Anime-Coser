import { supabase, getServerSupabase } from "./supabase"
import { cache } from "react"

// Cache duration in seconds (15 minutes)
const CACHE_DURATION = 15 * 60

// Cosplayers API
export const getCosplayers = cache(async ({ featured = false, limit = 100, page = 1 } = {}) => {
  let query = supabase
    .from("cosplayers")
    .select("*")
    .order("popularity", { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (featured) {
    query = query.eq("featured", true)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching cosplayers:", error)
    return []
  }

  return data
})

export const getCosplayerById = cache(async (id: number) => {
  const { data, error } = await supabase
    .from("cosplayers")
    .select(`
      *,
      gallery_items(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching cosplayer with ID ${id}:`, error)
    return null
  }

  return data
})

export const getCosplayerBySlug = cache(async (slug: string) => {
  const { data, error } = await supabase
    .from("cosplayers")
    .select(`
      *,
      gallery_items(*)
    `)
    .eq("slug", slug)
    .single()

  if (error) {
    console.error(`Error fetching cosplayer with slug ${slug}:`, error)
    return null
  }

  return data
})

// Gallery API
export const getGalleryItems = cache(async ({ featured = false, limit = 100, page = 1 } = {}) => {
  let query = supabase
    .from("gallery_items")
    .select(`
      *,
      cosplayers(id, name)
    `)
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (featured) {
    query = query.eq("featured", true)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching gallery items:", error)
    return []
  }

  return data
})

export const getGalleryItemById = cache(async (id: number) => {
  const { data, error } = await supabase
    .from("gallery_items")
    .select(`
      *,
      cosplayers(id, name)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching gallery item with ID ${id}:`, error)
    return null
  }

  return data
})

// Events API
export const getEvents = cache(async ({ featured = false, upcoming = false, limit = 100, page = 1 } = {}) => {
  let query = supabase
    .from("events")
    .select("*")
    .order("start_date", { ascending: true })
    .range((page - 1) * limit, page * limit - 1)

  if (featured) {
    query = query.eq("featured", true)
  }

  if (upcoming) {
    const today = new Date().toISOString()
    query = query.gte("start_date", today)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching events:", error)
    return []
  }

  return data
})

export const getEventById = cache(async (id: number) => {
  const { data, error } = await supabase.from("events").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching event with ID ${id}:`, error)
    return null
  }

  return data
})

// Blog API
export const getBlogPosts = cache(async ({ published = true, limit = 10, page = 1 } = {}) => {
  let query = supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (published) {
    query = query.eq("published", true)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }

  return data
})

export const getBlogPostBySlug = cache(async (slug: string) => {
  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).single()

  if (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error)
    return null
  }

  return data
})

// Pages API
export const getPageBySlug = cache(async (slug: string) => {
  const { data, error } = await supabase.from("pages").select("*").eq("slug", slug).single()

  if (error) {
    console.error(`Error fetching page with slug ${slug}:`, error)
    return null
  }

  return data
})

// Messages API
export const submitContactForm = async (formData: {
  name: string
  email: string
  subject: string
  message: string
}) => {
  const { data, error } = await supabase.from("messages").insert([
    {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      status: "unread",
    },
  ])

  if (error) {
    console.error("Error submitting contact form:", error)
    return { success: false, error }
  }

  return { success: true, data }
}

// Admin API functions (using server-side Supabase client with service role)
export const adminCreateCosplayer = async (cosplayerData: any) => {
  const supabaseAdmin = await getServerSupabase()

  const { data, error } = await supabaseAdmin.from("cosplayers").insert([cosplayerData]).select()

  if (error) {
    console.error("Error creating cosplayer:", error)
    return { success: false, error }
  }

  return { success: true, data: data[0] }
}

export const adminUpdateCosplayer = async (id: number, cosplayerData: any) => {
  const supabaseAdmin = await getServerSupabase()

  const { data, error } = await supabaseAdmin.from("cosplayers").update(cosplayerData).eq("id", id).select()

  if (error) {
    console.error(`Error updating cosplayer with ID ${id}:`, error)
    return { success: false, error }
  }

  return { success: true, data: data[0] }
}

export const adminDeleteCosplayer = async (id: number) => {
  const supabaseAdmin = await getServerSupabase()

  const { error } = await supabaseAdmin.from("cosplayers").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting cosplayer with ID ${id}:`, error)
    return { success: false, error }
  }

  return { success: true }
}

// Similar admin functions for other entities (gallery, events, blog posts, etc.)
export const adminCreateGalleryItem = async (galleryItemData: any) => {
  const supabaseAdmin = await getServerSupabase()

  const { data, error } = await supabaseAdmin.from("gallery_items").insert([galleryItemData]).select()

  if (error) {
    console.error("Error creating gallery item:", error)
    return { success: false, error }
  }

  return { success: true, data: data[0] }
}

export const adminUpdateGalleryItem = async (id: number, galleryItemData: any) => {
  const supabaseAdmin = await getServerSupabase()

  const { data, error } = await supabaseAdmin.from("gallery_items").update(galleryItemData).eq("id", id).select()

  if (error) {
    console.error(`Error updating gallery item with ID ${id}:`, error)
    return { success: false, error }
  }

  return { success: true, data: data[0] }
}

export const adminDeleteGalleryItem = async (id: number) => {
  const supabaseAdmin = await getServerSupabase()

  const { error } = await supabaseAdmin.from("gallery_items").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting gallery item with ID ${id}:`, error)
    return { success: false, error }
  }

  return { success: true }
}

