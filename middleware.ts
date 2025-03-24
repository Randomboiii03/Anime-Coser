import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If accessing admin routes, check if user is authenticated and is an admin
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!session) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Check if user is an admin
    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", session.user.id).single()

    if (!profile?.is_admin) {
      // Redirect to home if not an admin
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*"],
}

