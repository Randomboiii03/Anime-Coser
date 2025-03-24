"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, Save, Loader2, Eye } from "lucide-react"

// Import a rich text editor component
// For this example, we'll create a simple placeholder
function RichTextEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="border rounded-md p-4 min-h-[400px]">
      <textarea
        className="w-full h-[400px] focus:outline-none resize-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter page content here..."
      />
    </div>
  )
}

export default function EditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [page, setPage] = useState<any>(null)

  // Fetch page data
  useEffect(() => {
    const fetchPage = async () => {
      // In a real app, you would fetch this data from your API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Sample data
      const data = {
        id: Number.parseInt(params.id),
        title: "About Us",
        slug: "/about",
        content: `<h1>About AnimeCosu</h1>
<p>Learn about our mission, our team, and our passion for bringing the anime cosplay community together.</p>

<h2>Our Mission</h2>
<p>AnimeCosu was founded in 2018 with a simple mission: to create a vibrant online community that celebrates the art, creativity, and passion of anime cosplay.</p>

<p>We believe that cosplay is more than just dressing up—it's a form of artistic expression, a way to honor beloved characters, and a means to connect with like-minded fans from around the world.</p>

<p>Through our platform, we aim to showcase talented cosplayers, provide valuable resources and tutorials, highlight exciting events, and foster a supportive community where everyone—from beginners to professionals—can share their love for anime and cosplay.</p>

<h2>Meet Our Team</h2>
<p>Our dedicated team of cosplay enthusiasts works tirelessly to bring you the best content and experiences.</p>

<ul>
  <li><strong>Yuki Tanaka</strong> - Founder & Creative Director</li>
  <li><strong>Alex Chen</strong> - Content Manager</li>
  <li><strong>Maria Rodriguez</strong> - Community Manager</li>
  <li><strong>Kenji Watanabe</strong> - Event Coordinator</li>
</ul>

<h2>Our Story</h2>
<p>AnimeCosu began as a small blog run by a group of friends who shared a passion for anime cosplay. What started as a hobby quickly grew as more cosplayers discovered our platform and wanted to share their creations.</p>

<p>Today, AnimeCosu is one of the leading platforms for anime cosplay enthusiasts worldwide. Our community includes over 50,000 registered cosplayers, and our gallery features more than 100,000 cosplay photos.</p>`,
        metaTitle: "About Us | AnimeCosu - Anime Cosplay Community",
        metaDescription:
          "Learn about AnimeCosu's mission, team, and passion for bringing the anime cosplay community together.",
        lastUpdated: "2023-06-10T09:45:00",
        updatedBy: "Admin User",
      }

      setPage(data)
      setIsLoading(false)
    }

    fetchPage()
  }, [params.id])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // In a real app, you would submit the form data to your API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to pages list
      router.push("/admin/pages")
    } catch (error) {
      console.error("Error saving page:", error)
      setIsSaving(false)
    }
  }

  // Update page field
  const updatePage = (field: string, value: string) => {
    setPage({ ...page, [field]: value })
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/admin/pages" className="inline-flex items-center text-muted-foreground hover:text-foreground">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Pages
        </Link>
      </div>
      
      <div className="flex flex-col md:flex  />
          Back to Pages
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">\
        <div>
          <h1 className="text-3xl font-bold">Edit Page: {page.title}</h1>
          <p className="text-muted-foreground">Last updated on {new Date(page.lastUpdated).toLocaleDateString()} by {page.updatedBy}</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button 
            className="bg-pink-600 hover:bg-pink-700"
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
      
      <form
  onSubmit =
    { handleSubmit } >
    (
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
              <CardDescription>Edit the page title and content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Page Title</Label>
                <Input id="title" value={page.title} onChange={(e) => updatePage("title", e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex">
                  <span className="bg-muted px-3 py-2 rounded-l-md border border-r-0 text-muted-foreground">/</span>
                  <Input
                    id="slug"
                    value={page.slug.replace(/^\//, "")}
                    onChange={(e) => updatePage("slug", `/${e.target.value}`)}
                    className="rounded-l-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Page Content</Label>
                <RichTextEditor value={page.content} onChange={(value) => updatePage("content", value)} />
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
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={page.metaTitle}
                  onChange={(e) => updatePage("metaTitle", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Recommended length: 50-60 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Input
                  id="metaDescription"
                  value={page.metaDescription}
                  onChange={(e) => updatePage("metaDescription", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Recommended length: 150-160 characters</p>
              </div>

              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="border rounded-md p-4 bg-muted/30">
                  <p className="text-blue-600 text-lg font-medium line-clamp-1">{page.metaTitle}</p>
                  <p className="text-green-700 text-sm">
                    {window.location.origin}
                    {page.slug}
                  </p>
                  <p className="text-sm line-clamp-2">{page.metaDescription}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    ) <
    div
  className =
    "flex justify-end gap-4" >
    (
      <Button type="button" variant="outline" onClick={() => router.push("/admin/pages")}>
        Cancel
      </Button>
    ) <
    Button
  type = "submit"
  className = "bg-pink-600 hover:bg-pink-700"
  disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
  </Button>
        </div>
      </form>
    </div>
  )
}

