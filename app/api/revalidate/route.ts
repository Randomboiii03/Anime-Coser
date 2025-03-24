import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"

// This is a simple API route that can be called to revalidate specific paths or tags
export async function POST(request: NextRequest) {
  try {
    const { path, tag, secret } = await request.json()

    // Verify the request has the correct secret
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 })
    }

    // Revalidate the path if provided
    if (path) {
      revalidatePath(path)
      return NextResponse.json({ revalidated: true, path })
    }

    // Revalidate the tag if provided
    if (tag) {
      revalidateTag(tag)
      return NextResponse.json({ revalidated: true, tag })
    }

    return NextResponse.json({ message: "No path or tag provided" }, { status: 400 })
  } catch (error) {
    console.error("Error revalidating:", error)
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 })
  }
}

