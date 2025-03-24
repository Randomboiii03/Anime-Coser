"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Eye, Trash2, Filter, ArrowUpDown, Mail, CheckCircle } from "lucide-react"

export default function AdminMessages() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [messages, setMessages] = useState<any[]>([])
  const [filteredMessages, setFilteredMessages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null)

  // Fetch messages data
  useEffect(() => {
    const fetchMessages = async () => {
      // In a real app, you would fetch this data from your API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Sample data
      const data = [
        {
          id: 1,
          name: "John Smith",
          email: "john.smith@example.com",
          subject: "Collaboration Request",
          message:
            "Hello, I'm a professional photographer specializing in cosplay photography. I'd love to collaborate with some of your featured cosplayers for a photo shoot. Please let me know if this would be of interest.",
          date: "2023-06-15T14:30:00",
          status: "unread",
        },
        {
          id: 2,
          name: "Sarah Johnson",
          email: "sarah.j@example.com",
          subject: "Question about upcoming events",
          message:
            "Hi there, I'm planning to attend the Anime Expo 2023 and was wondering if you have any information about cosplay contests or meetups organized by AnimeCosu during the event. Thanks!",
          date: "2023-06-12T09:45:00",
          status: "read",
        },
        {
          id: 3,
          name: "Mike Chen",
          email: "mike.chen@example.com",
          subject: "Advertising Inquiry",
          message:
            "I represent a company that produces cosplay accessories and would like to discuss advertising opportunities on your platform. Please contact me at your earliest convenience to discuss potential partnership options.",
          date: "2023-06-10T16:20:00",
          status: "replied",
        },
        {
          id: 4,
          name: "Emma Wilson",
          email: "emma.w@example.com",
          subject: "Technical issue with the gallery",
          message:
            "I'm experiencing some issues with the gallery section of your website. When I try to view full-size images, they don't load properly. I'm using Chrome on Windows 10. Could you please look into this issue?",
          date: "2023-06-08T11:15:00",
          status: "read",
        },
        {
          id: 5,
          name: "David Lee",
          email: "david.lee@example.com",
          subject: "Featured Cosplayer Application",
          message:
            "Hello, I'd like to submit my portfolio for consideration as a featured cosplayer on your platform. I have over 5 years of experience and have won several awards at conventions. How can I apply for this opportunity?",
          date: "2023-06-05T13:50:00",
          status: "archived",
        },
      ]

      setMessages(data)
      setFilteredMessages(data)
      setIsLoading(false)
    }

    fetchMessages()
  }, [])

  // Filter and sort messages
  useEffect(() => {
    let result = [...messages]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (message) =>
          message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.message.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((message) => message.status === statusFilter)
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
    }

    setFilteredMessages(result)
  }, [searchTerm, statusFilter, sortBy, messages])

  // Mark message as read
  const markAsRead = (id: number) => {
    setMessages(messages.map((message) => (message.id === id ? { ...message, status: "read" } : message)))
  }

  // Mark message as replied
  const markAsReplied = (id: number) => {
    setMessages(messages.map((message) => (message.id === id ? { ...message, status: "replied" } : message)))
  }

  // Archive message
  const archiveMessage = (id: number) => {
    setMessages(messages.map((message) => (message.id === id ? { ...message, status: "archived" } : message)))
  }

  // Delete message
  const deleteMessage = (id: number) => {
    setMessages(messages.filter((message) => message.id !== id))
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage(null)
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Manage contact form submissions</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search messages..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-muted-foreground h-4 w-4" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Messages</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="text-muted-foreground h-4 w-4" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="md:col-span-1">
          <Card className="h-[calc(100vh-240px)]">
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>{filteredMessages.length} messages found</CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-auto h-[calc(100%-80px)]">
              {isLoading ? (
                <div className="space-y-4 p-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-full h-16 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="divide-y">
                  {filteredMessages.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No messages found</div>
                  ) : (
                    filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                          selectedMessage && selectedMessage.id === message.id ? "bg-muted" : ""
                        } ${message.status === "unread" ? "border-l-4 border-pink-500" : ""}`}
                        onClick={() => {
                          setSelectedMessage(message)
                          if (message.status === "unread") {
                            markAsRead(message.id)
                          }
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p
                              className={`font-medium truncate ${message.status === "unread" ? "text-foreground" : "text-muted-foreground"}`}
                            >
                              {message.name}
                            </p>
                            <p className="text-sm truncate">{message.subject}</p>
                          </div>
                          <div className="ml-2 flex flex-col items-end">
                            <StatusBadge status={message.status} />
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(message.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{message.message}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Message Detail */}
        <div className="md:col-span-2">
          <Card className="h-[calc(100vh-240px)]">
            {selectedMessage ? (
              <>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle>{selectedMessage.subject}</CardTitle>
                    <CardDescription>
                      From: {selectedMessage.name} ({selectedMessage.email})
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => markAsRead(selectedMessage.id)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Read
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => markAsReplied(selectedMessage.id)}>
                          <Mail className="mr-2 h-4 w-4" />
                          Mark as Replied
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => archiveMessage(selectedMessage.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => deleteMessage(selectedMessage.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 overflow-auto h-[calc(100%-160px)]">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={selectedMessage.status} />
                      <span>•</span>
                      <span>{new Date(selectedMessage.date).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="whitespace-pre-line">{selectedMessage.message}</p>
                  </div>
                </CardContent>
                <div className="p-4 border-t mt-auto">
                  <div className="flex gap-2">
                    <Button className="bg-pink-600 hover:bg-pink-700">
                      <Mail className="mr-2 h-4 w-4" />
                      Reply
                    </Button>
                    <Button variant="outline">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Replied
                    </Button>
                    <Button variant="outline">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No message selected</h3>
                <p className="text-muted-foreground">Select a message from the list to view its contents</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "unread":
      return (
        <Badge variant="default" className="bg-pink-100 text-pink-800 hover:bg-pink-200">
          Unread
        </Badge>
      )
    case "read":
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
          Read
        </Badge>
      )
    case "replied":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
          Replied
        </Badge>
      )
    case "archived":
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
          Archived
        </Badge>
      )
    default:
      return null
  }
}

