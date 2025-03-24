import { createMessage } from "@/lib/api/messages"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create message in database
    const messageId = await createMessage({
      name,
      email,
      subject,
      message,
    })

    if (!messageId) {
      return NextResponse.json({ error: "Failed to submit message" }, { status: 500 })
    }

    return NextResponse.json({ success: true, messageId })
  } catch (error) {
    console.error("Error in contact form submission:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

