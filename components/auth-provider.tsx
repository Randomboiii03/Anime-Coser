"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

type User = {
  id: string
  email: string
  isAdmin: boolean
} | null

type AuthContextType = {
  user: User
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => ({ error: new Error("Not implemented") }),
  signOut: async () => {},
  isLoading: true,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // If Supabase is not configured, skip auth
    if (!supabase) {
      setIsLoading(false)
      return
    }

    // Check for existing session
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          // Get user profile to check if admin
          const { data: profile } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", session.user.id)
            .single()

          setUser({
            id: session.user.id,
            email: session.user.email || "",
            isAdmin: profile?.is_admin || false,
          })
        }
      } catch (error) {
        console.error("Error checking auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // Get user profile to check if admin
        const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", session.user.id).single()

        setUser({
          id: session.user.id,
          email: session.user.email || "",
          isAdmin: profile?.is_admin || false,
        })
      } else {
        setUser(null)
      }

      // Force a router refresh to update server components
      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: new Error("Supabase is not configured. Please set the environment variables.") }
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      return { error }
    } catch (error) {
      console.error("Error signing in:", error)
      return { error }
    }
  }

  const signOut = async () => {
    if (!supabase) return

    try {
      await supabase.auth.signOut()
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>{children}</AuthContext.Provider>
}

