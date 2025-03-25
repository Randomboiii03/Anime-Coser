"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function AdminPages() {
  const [searchTerm, setSearchTerm] = useState("")
  const [pages, setPages] = useState<any[]>([])
  const [filteredPages, setFilteredPages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch pages
  useEffect(() => {
    const fetchPages = async () => {
      setIsLoading(true)

      try {
        const { data, error } = await supabase.from("pages").select("*").order("title", { ascending: true })

        if (error) throw error

        setPages(data || [])
        setFilteredPages(data || [])
      } catch (error) {
        console.error("Error fetching pages:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPages()

    // Set up real-time subscription
    const subscription = supabase
      .channel("pages_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pages",
        },
        (payload) => {
          // Refresh the data when changes occur
          fetchPages()
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Filter pages based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredPages(pages)
      return
    }

    const filtered = pages.filter(
      (page) =>
        page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.content?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    setFilteredPages(filtered)
  }, [searchTerm, pages])

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Delete page
  const handleDeletePage = async (id: number) => {
    if (!confirm("Are you sure you want to delete this page?")) return

    try {
      const { error } = await supabase.from("pages").delete().eq("id", id)

      if (error) throw error

      // Remove from local state
      setPages(pages.filter((page) => page.id !== id))
    } catch (error) {
      console.error("Error deleting page:", error)
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Pages</h1>
          <p className="text-muted-foreground">Manage your website pages</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/admin/pages/new">
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Plus className="mr-2 h-4 w-4" />
              Create New Page
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search pages..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pages</CardTitle>
          <CardDescription>{filteredPages.length} pages found</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No pages found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell>
                        <div className="font-medium">{page.title}</div>
                      </TableCell>
                      <TableCell>/{page.slug}</TableCell>
                      <TableCell>{formatDate(page.updated_at || page.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/${page.slug}`} target="_blank">
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/pages/edit/${page.id}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeletePage(page.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

