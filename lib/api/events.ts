import { supabase, getImageUrl } from "@/lib/supabase"
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
    imageUrl: event.image_path ? getImageUrl("events", event.image_path) : "/placeholder.svg?height=600&width=800",
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

// Get event by ID with caching
export const getEventById = cache(async (id: number): Promise<Event | null> => {
  const { data, error } = await supabase.from("events").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching event with ID ${id}:`, error)
    return null
  }

  return transformEvent(data)
})

// Get events by type with caching
export const getEventsByType = cache(async (eventType: string): Promise<Event[]> => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("event_type", eventType)
    .order("date", { ascending: true })

  if (error) {
    console.error(`Error fetching events with type ${eventType}:`, error)
    return []
  }

  return data.map(transformEvent)
})

// Create a new event
export async function createEvent(
  event: Omit<Event, "id" | "imageUrl" | "createdAt" | "updatedAt">,
): Promise<number | null> {
  const { data, error } = await supabase
    .from("events")
    .insert({
      title: event.title,
      location: event.location,
      date: event.date,
      end_date: event.endDate,
      description: event.description,
      image_path: event.imagePath,
      tags: event.tags,
      event_type: event.eventType,
      featured: event.featured,
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error creating event:", error)
    return null
  }

  return data.id
}

// Update an existing event
export async function updateEvent(
  id: number,
  event: Partial<Omit<Event, "id" | "imageUrl" | "createdAt" | "updatedAt">>,
): Promise<boolean> {
  const updateData: any = {}

  if (event.title !== undefined) updateData.title = event.title
  if (event.location !== undefined) updateData.location = event.location
  if (event.date !== undefined) updateData.date = event.date
  if (event.endDate !== undefined) updateData.end_date = event.endDate
  if (event.description !== undefined) updateData.description = event.description
  if (event.imagePath !== undefined) updateData.image_path = event.imagePath
  if (event.tags !== undefined) updateData.tags = event.tags
  if (event.eventType !== undefined) updateData.event_type = event.eventType
  if (event.featured !== undefined) updateData.featured = event.featured

  const { error } = await supabase.from("events").update(updateData).eq("id", id)

  if (error) {
    console.error(`Error updating event with ID ${id}:`, error)
    return false
  }

  return true
}

// Delete an event
export async function deleteEvent(id: number): Promise<boolean> {
  const { error } = await supabase.from("events").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting event with ID ${id}:`, error)
    return false
  }

  return true
}

