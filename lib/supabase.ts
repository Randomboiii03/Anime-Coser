import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Check if we have the required environment variables
const hasSupabaseCredentials = supabaseUrl && supabaseAnonKey

// Create a regular supabase client for public operations
export const supabase = hasSupabaseCredentials ? createClient<Database>(supabaseUrl, supabaseAnonKey) : null

// Create a supabase client with the service role key for admin operations
// Only create if we have the service role key
export const supabaseAdmin =
  hasSupabaseCredentials && supabaseServiceKey ? createClient<Database>(supabaseUrl, supabaseServiceKey) : null

// Helper function to get image URL from Supabase Storage
export function getImageUrl(bucket: string, path: string | null): string {
  if (!path) {
    return `/api/placeholder?height=600&width=400`
  }

  // If the path is already a full URL, return it
  if (path.startsWith("http")) {
    return path
  }

  // If we're in development or the path doesn't exist in storage, use a placeholder
  if (!hasSupabaseCredentials || !supabase) {
    return `/api/placeholder?height=600&width=400&text=${encodeURIComponent(path)}`
  }

  // Construct the Supabase storage URL
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export async function getServerSupabase() {
  if (!hasSupabaseCredentials || !supabaseServiceKey) {
    console.error("Supabase credentials are missing. Please set the environment variables.")
    // Return a mock client that will throw errors when used
    return {
      from: () => {
        throw new Error("Supabase is not configured. Please set the environment variables.")
      },
      storage: {
        from: () => {
          throw new Error("Supabase is not configured. Please set the environment variables.")
        },
      },
      auth: {
        getUser: async () => {
          throw new Error("Supabase is not configured. Please set the environment variables.")
        },
      },
    } as any
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function uploadImage(bucket: string, fileName: string, file: File): Promise<{ data: any; error: any }> {
  const serverSupabase = await getServerSupabase()

  try {
    const { data, error } = await serverSupabase.storage.from(bucket).upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    return { data, error }
  } catch (error) {
    console.error("Error uploading image:", error)
    return { data: null, error: error as any }
  }
}

