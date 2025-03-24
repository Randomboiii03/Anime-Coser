import { supabase } from "@/lib/supabase"
import { cache } from "react"

export type Message = {
  id: number
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

// Transform database message to frontend message
function transformMessage(message: any): Message {
  return {
    id: message.id,
    name: message.name,
    email: message.email,
    subject: message.subject,
    message: message.message,
    read: message.read || false,
    createdAt: message.created_at,
  }
}

// Get all messages with caching
export const getMessages = cache(async (): Promise<Message[]> => {
  const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching messages:", error)
    return []
  }

  return data.map(transformMessage)
})

// Get unread messages with caching
export const getUnreadMessages = cache(async (): Promise<Message[]> => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("read", false)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching unread messages:", error)
    return []
  }

  return data.map(transformMessage)
})

// Get message by ID with caching
export const getMessageById = cache(async (id: number): Promise<Message | null> => {
  const { data, error } = await supabase.from("messages").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching message with ID ${id}:`, error)
    return null
  }

  return transformMessage(data)
})

// Create a new message
export async function createMessage(message: Omit<Message, "id" | "read" | "createdAt">): Promise<number | null> {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
      read: false,
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error creating message:", error)
    return null
  }

  return data.id
}

// Mark message as read
export async function markMessageAsRead(id: number): Promise<boolean> {
  const { error } = await supabase.from("messages").update({ read: true }).eq("id", id)

  if (error) {
    console.error(`Error marking message with ID ${id} as read:`, error)
    return false
  }

  return true
}

// Delete a message
export async function deleteMessage(id: number): Promise<boolean> {
  const { error } = await supabase.from("messages").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting message with ID ${id}:`, error)
    return false
  }

  return true
}

