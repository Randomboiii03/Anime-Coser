"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Users,
  ImageIcon,
  Calendar,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Heart,
  Plus,
  Image,
  FileText,
  UserCircle,
} from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    cosplayers: 0,
    galleryItems: 0,
    events: 0,
    messages: 0,
    pages: 0,
    users: 0,
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching dashboard data
    const fetchDashboardData = async () => {
      // In a real app, you would fetch this data from your API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setStats({
        cosplayers: 156,
        galleryItems: 432,
        events: 28,
        messages: 47,
        pages: 15,
        users: 78,
      })

      setIsLoading(false)
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Admin User</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button className="bg-pink-600 hover:bg-pink-700">
            <Plus className="mr-2 h-4 w-4" />
            New Cosplayer
          </Button>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            New Gallery Item
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Cosplayers"
          value={stats.cosplayers}
          icon={<Users className="h-5 w-5" />}
          description="Total cosplayers"
          href="/admin/cosplayers"
        />
        <DashboardCard
          title="Gallery Items"
          value={stats.galleryItems}
          icon={<Image className="h-5 w-5" />}
          description="Total gallery items"
          href="/admin/gallery"
        />
        <DashboardCard
          title="Events"
          value={stats.events}
          icon={<Calendar className="h-5 w-5" />}
          description="Total events"
          href="/admin/events"
        />
        <DashboardCard
          title="Messages"
          value={stats.messages}
          icon={<MessageSquare className="h-5 w-5" />}
          description="Unread messages"
          href="/admin/messages"
        />
        <DashboardCard
          title="Pages"
          value={stats.pages}
          icon={<FileText className="h-5 w-5" />}
          description="Custom pages"
          href="/admin/pages"
        />
        <DashboardCard
          title="Users"
          value={stats.users}
          icon={<UserCircle className="h-5 w-5" />}
          description="Registered users"
          href="/admin/users"
        />
      </div>

      {/* Activity and Analytics */}
      <Tabs defaultValue="activity" className="mb-6">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and changes to the website</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                        <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <ActivityItem
                    title="New cosplayer profile created"
                    description="Sakura Cosplay added a new profile"
                    time="2 hours ago"
                    icon={<Users className="h-4 w-4" />}
                  />
                  <ActivityItem
                    title="Gallery updated"
                    description="15 new photos added to Demon Slayer category"
                    time="5 hours ago"
                    icon={<ImageIcon className="h-4 w-4" />}
                  />
                  <ActivityItem
                    title="New event scheduled"
                    description="Anime Expo 2023 event details updated"
                    time="Yesterday"
                    icon={<Calendar className="h-4 w-4" />}
                  />
                  <ActivityItem
                    title="Contact form submission"
                    description="New collaboration request received"
                    time="2 days ago"
                    icon={<MessageSquare className="h-4 w-4" />}
                  />
                  <ActivityItem
                    title="About page updated"
                    description="Team member information updated"
                    time="3 days ago"
                    icon={<Users className="h-4 w-4" />}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Website Traffic</CardTitle>
                <CardDescription>Page views and visitor statistics</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[200px] bg-muted rounded animate-pulse" />
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Page Views</p>
                          <p className="text-sm text-muted-foreground">Last 30 days</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{stats.pageViews.toLocaleString()}</p>
                        <div className="flex items-center text-sm text-green-600">
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                          <span>12% increase</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-[150px] bg-muted/40 rounded-lg flex items-end justify-between p-2">
                      {[35, 45, 30, 65, 40, 80, 60, 75, 50, 70, 90, 65].map((height, i) => (
                        <div
                          key={i}
                          className="w-full bg-pink-600 rounded-t mx-[1px]"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Engagement</CardTitle>
                <CardDescription>User interactions and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[200px] bg-muted rounded animate-pulse" />
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Total Likes</p>
                          <p className="text-sm text-muted-foreground">Last 30 days</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{stats.likes.toLocaleString()}</p>
                        <div className="flex items-center text-sm text-red-600">
                          <ArrowDownRight className="h-4 w-4 mr-1" />
                          <span>3% decrease</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/40 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">New Cosplayers</p>
                        <p className="text-2xl font-bold">{stats.newCosplayers}</p>
                        <div className="flex items-center text-sm text-green-600 mt-1">
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                          <span>8%</span>
                        </div>
                      </div>
                      <div className="bg-muted/40 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">New Gallery Items</p>
                        <p className="text-2xl font-bold">{stats.newGalleryItems}</p>
                        <div className="flex items-center text-sm text-green-600 mt-1">
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                          <span>15%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionButton
              icon={<Users className="h-5 w-5" />}
              label="Add Cosplayer"
              href="/admin/cosplayers/new"
            />
            <QuickActionButton
              icon={<ImageIcon className="h-5 w-5" />}
              label="Upload Images"
              href="/admin/gallery/upload"
            />
            <QuickActionButton icon={<Calendar className="h-5 w-5" />} label="Add Event" href="/admin/events/new" />
            <QuickActionButton icon={<BarChart className="h-5 w-5" />} label="View Reports" href="/admin/reports" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Stats Card Component
function DashboardCard({
  title,
  value,
  icon,
  description,
  href,
}: {
  title: string
  value: number
  icon: React.ReactNode
  description: string
  href: string
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="p-2 bg-muted rounded-full">{icon}</div>
        </div>
        <div className="mt-4">
          <Link href={href}>
            <Button variant="ghost" size="sm" className="w-full justify-between">
              View Details
              <TrendingUp className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

// Activity Item Component
function ActivityItem({
  title,
  description,
  time,
  icon,
}: {
  title: string
  description: string
  time: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-2 bg-muted rounded-full">{icon}</div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground mt-1">{time}</p>
      </div>
    </div>
  )
}

// Quick Action Button Component
function QuickActionButton({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode
  label: string
  href: string
}) {
  return (
    <Link href={href}>
      <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
        <div className="p-2 bg-muted rounded-full">{icon}</div>
        <span>{label}</span>
      </Button>
    </Link>
  )
}

