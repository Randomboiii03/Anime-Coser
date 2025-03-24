import { incrementGalleryItemLikes } from "@/lib/api/gallery"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { galleryItemId } = body

    if (!galleryItemId) {
      return NextResponse.json({ error: "Missing gallery item ID" }, { status: 400 })
    }

    const success = await incrementGalleryItemLikes(galleryItemId)

    if (!success) {
      return NextResponse.json({ error: "Failed to increment likes" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error incrementing likes:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

