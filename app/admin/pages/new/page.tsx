"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, Save, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import dynamic from "next/dynamic"

// Dynamically import the editor to avoid SSR issues
const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
  loading: () => <div className="h-64 w-full bg-muted animate-pulse rounded-md"></div>,
})

export default function NewPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    meta_title: "",
    meta_description: "",
  })

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Auto-generate slug from title
    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")

      setFormData({
        ...formData,
        title: value,
        slug,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  // Handle editor content change
  const handleEditorChange = (content: string) => {
    setFormData({
      ...formData,
      content,
    })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare data for submission
      const pageData = {
        ...formData,
        updated_at: new Date().toISOString(),
        updated_by: "Admin User", // In a real app, this would be the current user
      }

      // Insert into database
      const { data, error } = await supabase.from("pages").insert([pageData]).select()

      if (error) throw error

      // Trigger revalidation
      await fetch("/api/revalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: `/${formData.slug}`,
          secret: process.env.NEXT_PUBLIC_REVALIDATION_SECRET,
        }),
      })

      // Redirect to pages list
      router.push("/admin/pages")
    } catch (error) {
      console.error("Error creating page:", error)
      alert("Failed to create page. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/admin/pages" className="inline-flex items-center text-muted-foreground hover:text-foreground">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Pages
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Page</h1>
          <p className="text-muted-foreground">Create a new page for your website</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="content" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO & Settings</TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Page Content</CardTitle>
                <CardDescription>Create your page content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Page Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter page title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <div className="flex">
                    <span className="bg-muted px-3 py-2 rounded-l-md border border-r-0 text-muted-foreground">/</span>
                    <Input
                      id="slug"
                      name="slug"
                      placeholder="Enter URL slug"
                      value={formData.slug}
                      onChange={handleChange}
                      className="rounded-l-none"
                      required
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">This will be used in the URL: /{formData.slug}</p>
                </div>

                <div className="space-y-2">
                  <Label>Content</Label>
                  <Editor initialValue="" onChange={handleEditorChange} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO & Settings</CardTitle>
                <CardDescription>Configure search engine optimization settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    name="meta_title"
                    placeholder="Enter meta title"
                    value={formData.meta_title}
                    onChange={handleChange}
                  />
                  <p className="text-sm text-muted-foreground">Recommended length: 50-60 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Input
                    id="meta_description"
                    name="meta_description"
                    placeholder="Enter meta description"
                    value={formData.meta_description}
                    onChange={handleChange}
                  />
                  <p className="text-sm text-muted-foreground">Recommended length: 150-160 characters</p>
                </div>

                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="border rounded-md p-4 bg-muted/30">
                    <p className="text-blue-600 text-lg font-medium line-clamp-1">
                      {formData.meta_title || formData.title || "Page Title"}
                    </p>
                    <p className="text-green-700 text-sm">
                      {typeof window !== "undefined" ? window.location.origin : "https://example.com"}/{formData.slug}
                    </p>
                    <p className="text-sm line-clamp-2">
                      {formData.meta_description || "Page description will appear here."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/pages")}>
            Cancel
          </Button>
          <Button type="submit" className="bg-pink-600 hover:bg-pink-700" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Page
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

