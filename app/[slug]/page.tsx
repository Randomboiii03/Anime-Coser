import { notFound } from "next/navigation"
import { getPage } from "@/lib/api/pages"

interface DynamicPageProps {
  params: {
    slug: string
  }
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  // In Next.js 15, params is already a regular object, not a promise
  // We don't need to await it, but we should handle it properly
  const { slug } = params

  // Skip rendering for paths that have dedicated routes
  const reservedPaths = ["admin", "blog", "cosplayers", "gallery", "events", "about", "contact"]
  if (reservedPaths.includes(slug)) {
    notFound()
  }

  const page = await getPage(slug)

  if (!page) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{page.title}</h1>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
    </div>
  )
}

