import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const width = Number.parseInt(searchParams.get("width") || "400", 10)
  const height = Number.parseInt(searchParams.get("height") || "300", 10)
  const text = searchParams.get("text") || ""

  // Create an SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text 
        x="50%" 
        y="50%" 
        font-family="Arial, sans-serif" 
        font-size="16" 
        text-anchor="middle" 
        dominant-baseline="middle"
        fill="#888888"
      >
        ${text || `${width}x${height}`}
      </text>
    </svg>
  `

  // Return the SVG with appropriate headers
  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}

