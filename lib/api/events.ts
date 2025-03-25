import { supabase } from "@/lib/supabase"
import { cache } from "react"

export type Event = {
  id: number
  title: string
  location: string
  date: string
  endDate: string | null
  description: string
  imagePath: string | null
  imageUrl: string
  tags: string[]
  eventType: "convention" | "competition" | "workshop" | "meetup"
  featured: boolean
  createdAt: string
  updatedAt: string
}

// Transform database event to frontend event
function transformEvent(event: any): Event {
  return {
    id: event.id,
    title: event.title,
    location: event.location,
    date: event.date,
    endDate: event.end_date,
    description: event.description,
    imagePath: event.image_path,
    imageUrl: event.image_path
      ? event.image_path.startsWith("http")
        ? event.image_path
        : `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(event.title || "Event Image")}`
      : "/placeholder.svg?height=400&width=600",
    tags: event.tags || [],
    eventType: event.event_type || "convention",
    featured: event.featured || false,
    createdAt: event.created_at,
    updatedAt: event.updated_at,
  }
}

// Get all events with caching
export const getEvents = cache(async (): Promise<Event[]> => {
  const { data, error } = await supabase.from("events").select("*").order("date", { ascending: true })

  if (error) {
    console.error("Error fetching events:", error)
    return []
  }

  return data.map(transformEvent)
})

// Get upcoming events with caching
export const getUpcomingEvents = cache(async (limit = 10): Promise<Event[]> => {
  const today = new Date().toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gte("date", today)
    .order("date", { ascending: true })
    .limit(limit)

  if (error) {
    console.error("Error fetching upcoming events:", error)
    return []
  }

  return data.map(transformEvent)
})

// Get featured events with caching
export const getFeaturedEvents = cache(async (): Promise<Event[]> => {
  const today = new Date().toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("featured", true)
    .gte("date", today)
    .order("date", { ascending: true })
    .limit(3)

  if (error) {
    console.error("Error fetching featured events:", error)
    return []
  }

  return data.map(transformEvent)
})

