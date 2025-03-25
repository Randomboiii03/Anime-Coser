import { supabase } from "@/lib/supabase"
import { cache } from "react"

export type Page = {
  id: number
  title: string
  slug: string
  content: string
  published: boolean
  createdAt: string
  updatedAt: string
}

// Transform database page to frontend page
function transformPage(page: any): Page {
  return {
    id: page.id,
    title: page.title,
    slug: page.slug,
    content: page.content,
    published: page.published,
    createdAt: page.created_at,
    updatedAt: page.updated_at,
  }
}

// Get all pages with caching
export const getPages = cache(async (): Promise<Page[]> => {
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("published", true)
    .order("title", { ascending: true })

  if (error) {
    console.error("Error fetching pages:", error)
    return []
  }

  return data.map(transformPage)
})

// Get page by slug with caching
export const getPage = cache(async (slug: string): Promise<Page | null> => {
  const { data, error } = await supabase.from("pages").select("*").eq("slug", slug).eq("published", true).single()

  if (error) {
    console.error(`Error fetching page with slug ${slug}:`, error)
    return null
  }

  return transformPage(data)
})

// Get page by ID with caching
export const getPageById = cache(async (id: number): Promise<Page | null> => {
  const { data, error } = await supabase.from("pages").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching page with ID ${id}:`, error)
    return null
  }

  return transformPage(data)
})

