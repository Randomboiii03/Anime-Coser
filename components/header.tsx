"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import { ModeToggle } from "./mode-toggle"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-2xl text-pink-600">
            AnimeCosu
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:gap-10">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Cosplayers</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-purple-500 to-pink-500 p-6 no-underline outline-none focus:shadow-md"
                          href="/featured"
                        >
                          <div className="mt-4 mb-2 text-lg font-medium text-white">Featured Cosplayers</div>
                          <p className="text-sm leading-tight text-white/90">
                            Discover our top cosplayers and their amazing creations
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/cosplayers" title="All Cosplayers">
                      Browse our complete directory of talented cosplayers
                    </ListItem>
                    <ListItem href="/cosplayers/categories" title="By Anime">
                      Find cosplayers by your favorite anime series
                    </ListItem>
                    <ListItem href="/cosplayers/join" title="Join as Cosplayer">
                      Create your profile and showcase your work
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Gallery</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <ListItem href="/gallery" title="All Photos">
                      Browse our complete gallery of cosplay photos
                    </ListItem>
                    <ListItem href="/gallery/recent" title="Recent Uploads">
                      Check out the latest cosplay photos
                    </ListItem>
                    <ListItem href="/gallery/popular" title="Popular">
                      See the most liked cosplay creations
                    </ListItem>
                    <ListItem href="/gallery/categories" title="Categories">
                      Browse by anime, character, or style
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/cosplayers/featured" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Featured</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/events" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Events</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>About</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button className="hidden md:inline-flex bg-pink-600 hover:bg-pink-700">Contact Us</Button>

          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <Link
              href="/"
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/cosplayers"
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cosplayers
            </Link>
            <Link
              href="/gallery"
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link
              href="/cosplayers/featured"
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Featured
            </Link>
            <Link
              href="/events"
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              href="/about"
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a"> & { title: string }>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"

