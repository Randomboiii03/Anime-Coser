"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface EditorProps {
  initialValue: string
  onChange: (content: string) => void
}

export default function Editor({ initialValue, onChange }: EditorProps) {
  const [editorLoaded, setEditorLoaded] = useState(false)
  const [content, setContent] = useState(initialValue)

  // Load the editor on the client side
  useEffect(() => {
    setEditorLoaded(true)
  }, [])

  // Handle content change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    onChange(newContent)
  }

  if (!editorLoaded) {
    return <div className="h-64 w-full bg-muted animate-pulse rounded-md"></div>
  }

  // Simple textarea editor for now
  // In a real app, you might want to use a rich text editor like TinyMCE, CKEditor, or Quill
  return (
    <textarea
      className="w-full min-h-[300px] p-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
      value={content}
      onChange={handleChange}
      placeholder="Write your content here..."
    />
  )
}

