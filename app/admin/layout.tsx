"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users, Calendar, MessageSquare, FileText, Settings, LogOut, Menu, Home, Image } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/auth-provider"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading, signOut } = useAuth()

  // Check authentication on mount
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user && pathname !== "/admin/login") {
      router.push("/admin/login")
    } else if (user) {
      setIsAuthenticated(true)
    }
  }, [user, isLoading, router, pathname])

  // Handle logout
  const handleLogout = async () => {
    await signOut()
    router.push("/admin/login")
  }

  // If on login page or not authenticated, just render children
  if (pathname === "/admin/login" || !isAuthenticated) {
    return <>{children}</>
  }

  const navigationItems = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Cosplayers", href: "/admin/cosplayers", icon: Users },
    { name: "Gallery", href: "/admin/gallery", icon: Image },
    { name: "Events", href: "/admin/events", icon: Calendar },
    { name: "Pages", href: "/admin/pages", icon: FileText },
    { name: "Messages", href: "/admin/messages", icon: MessageSquare },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-10">
        <div className="flex flex-col flex-grow bg-background border-r pt-5 overflow-y-auto">
          <div className="flex items-center justify-center px-4">
            <Link href="/admin" className="font-bold text-2xl text-pink-600">
              AnimeCosu <span className="text-sm font-normal text-muted-foreground">Admin</span>
            </Link>
          </div>

          <div className="flex flex-col items-center mt-6 px-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg?height=50&width=50" alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <h2 className="mt-2 text-xl font-semibold">{user?.email?.split("@")[0] || "Admin User"}</h2>
            <p className="text-sm text-muted-foreground">Administrator</p>
          </div>

          <ScrollArea className="flex-1 mt-6">
            <nav className="px-4 pb-4">
              {navigationItems.map((item) => (
                <SidebarLink key={item.name} href={item.href} icon={item.icon} label={item.name} pathname={pathname} />
              ))}

              <Separator className="my-4" />

              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={handleLogout}
              >
                <LogOut size={20} className="mr-2" />
                Logout
              </Button>
            </nav>
          </ScrollArea>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <Menu size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <div className="flex flex-col h-full bg-background pt-5">
            <div className="flex items-center justify-center px-4">
              <Link href="/admin" className="font-bold text-2xl text-pink-600">
                AnimeCosu <span className="text-sm font-normal text-muted-foreground">Admin</span>
              </Link>
            </div>

            <div className="flex flex-col items-center mt-6 px-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg?height=50&width=50" alt="Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <h2 className="mt-2 text-xl font-semibold">{user?.email?.split("@")[0] || "Admin User"}</h2>
              <p className="text-sm text-muted-foreground">Administrator</p>
            </div>

            <ScrollArea className="flex-1 mt-6">
              <nav className="px-4 pb-4">
                {navigationItems.map((item) => (
                  <SidebarLink
                    key={item.name}
                    href={item.href}
                    icon={item.icon}
                    label={item.name}
                    pathname={pathname}
                  />
                ))}

                <Separator className="my-4" />

                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={handleLogout}
                >
                  <LogOut size={20} className="mr-2" />
                  Logout
                </Button>
              </nav>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="md:ml-64 flex-1">{children}</main>
    </div>
  )
}

// Sidebar Link Component
function SidebarLink({
  href,
  icon,
  label,
  pathname,
}: {
  href: string
  icon: React.ReactNode
  label: string
  pathname: string
}) {
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link href={href}>
      <Button
        variant="ghost"
        className={`w-full justify-start mb-1 ${
          isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
      >
        {icon}
        <span className="ml-2">{label}</span>
      </Button>
    </Link>
  )
}

