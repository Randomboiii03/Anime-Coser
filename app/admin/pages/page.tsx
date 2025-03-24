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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, FileText, Clock } from "lucide-react"

export default function AdminPages() {
  const [searchTerm, setSearchTerm] = useState("")
  const [pages, setPages] = useState<any[]>([])
  const [filteredPages, setFilteredPages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch pages data
  useEffect(() => {
    const fetchPages = async () => {
      // In a real app, you would fetch this data from your API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Sample data
      const data = [
        {
          id: 1,
          title: "Home",
          slug: "/",
          lastUpdated: "2023-06-15T14:30:00",
          updatedBy: "Admin User",
        },
        {
          id: 2,
          title: "About Us",
          slug: "/about",
          lastUpdated: "2023-06-10T09:45:00",
          updatedBy: "Admin User",
        },
        {
          id: 3,
          title: "Cosplayers",
          slug: "/cosplayers",
          lastUpdated: "2023-06-08T16:20:00",
          updatedBy: "Content Manager",
        },
        {
          id: 4,
          title: "Gallery",
          slug: "/gallery",
          lastUpdated: "2023-06-05T11:15:00",
          updatedBy: "Admin User",
        },
        {
          id: 5,
          title: "Events",
          slug: "/events",
          lastUpdated: "2023-06-01T13:50:00",
          updatedBy: "Content Manager",
        },
        {
          id: 6,
          title: "Contact Us",
          slug: "/contact",
          lastUpdated: "2023-05-28T10:30:00",
          updatedBy: "Admin User",
        },
        {
          id: 7,
          title: "Privacy Policy",
          slug: "/privacy",
          lastUpdated: "2023-05-20T15:45:00",
          updatedBy: "Admin User",
        },
        {
          id: 8,
          title: "Terms of Service",
          slug: "/terms",
          lastUpdated: "2023-05-20T15:30:00",
          updatedBy: "Admin User",
        },
      ]

      setPages(data)
      setFilteredPages(data)
      setIsLoading(false)
    }

    fetchPages()
  }, [])

  // Filter pages
  useEffect(() => {
    if (searchTerm) {
      const filtered = pages.filter(
        (page) =>
          page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          page.slug.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredPages(filtered)
    } else {
      setFilteredPages(pages)
    }
  }, [searchTerm, pages])

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Pages</h1>
          <p className="text-muted-foreground">Manage website pages and content</p>
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
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search pages..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

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
                  <TableHead>Page Title</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Updated By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No pages found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span className="font-medium">{page.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded text-sm">{page.slug}</code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(page.lastUpdated).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>{page.updatedBy}</TableCell>
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
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Page
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
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

