import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Check if Supabase environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase environment variables are not set")
    // If accessing admin area without Supabase configured, redirect to home
    if (req.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", req.url))
    }
    return res
  }

  const supabase = createMiddlewareClient({ req, res })

  // Check if the request is for the admin area
  if (req.nextUrl.pathname.startsWith("/admin")) {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      // If no session, redirect to admin login
      if (!session) {
        const redirectUrl = new URL("/admin/login", req.url)
        return NextResponse.redirect(redirectUrl)
      }

      // Check if user is an admin
      const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", session.user.id).single()

      if (!profile?.is_admin) {
        // Redirect to home if not an admin
        return NextResponse.redirect(new URL("/", req.url))
      }
    } catch (error) {
      console.error("Error in middleware:", error)
      // If there's an error, redirect to home
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return res
}

// Only run middleware on admin routes
export const config = {
  matcher: "/admin/:path*",
}

