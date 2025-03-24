import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"

// Set revalidation time to 15 minutes (900 seconds)
export const revalidate = 900

// Generate static params for common pages
export async function generateStaticParams() {
  const { data } = await supabase.from("pages").select("slug").order("title", { ascending: true })

  return (data || []).map((page) => ({
    slug: page.slug,
  }))
}

async function getPage(slug: string) {
  const { data, error } = await supabase.from("pages").select("*").eq("slug", slug).single()

  if (error || !data) {
    return null
  }

  return data
}

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  // Skip rendering for paths that have dedicated routes
  const reservedPaths = ["admin", "blog", "cosplayers", "gallery", "events", "about", "contact"]
  if (reservedPaths.includes(params.slug)) {
    notFound()
  }

  const page = await getPage(params.slug)

  if (!page) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">{page.title}</h1>

        <div
          className="prose prose-lg max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  )
}

