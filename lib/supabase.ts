import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create a single supabase client for the browser
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper function to get authenticated supabase client on the server
export const getServerSupabase = async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  return createClient<Database>(supabaseUrl, supabaseServiceKey)
}

// Helper function to handle image uploads to Supabase Storage
export const uploadImage = async (file: File, bucket: string, path: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `${path}/${fileName}`

    const { error: uploadError, data } = await supabase.storage.from(bucket).upload(filePath, file)

    if (uploadError) {
      console.error("Error uploading file:", uploadError)
      return null
    }

    // Get public URL for the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error("Error in upload process:", error)
    return null
  }
}

// Helper function to delete an image from Supabase Storage
export const deleteImage = async (bucket: string, path: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      console.error("Error deleting file:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in delete process:", error)
    return false
  }
}

