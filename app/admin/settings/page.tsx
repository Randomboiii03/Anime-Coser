"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Loader2, Upload, Users, Shield, Mail, Globe } from "lucide-react"

export default function AdminSettings() {
  const [isSaving, setIsSaving] = useState(false)

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // In a real app, you would submit the form data to your API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSaving(false)
    } catch (error) {
      console.error("Error saving settings:", error)
      setIsSaving(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure website settings and preferences</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button className="bg-pink-600 hover:bg-pink-700" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="users">Users & Roles</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* General Settings Tab */}
          <TabsContent value="general">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Site Information</CardTitle>
                  <CardDescription>Basic information about your website</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input id="siteName" defaultValue="AnimeCosu" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">Site Description</Label>
                    <Textarea
                      id="siteDescription"
                      defaultValue="Discover amazing cosplayers, tutorials, events and more in the world of anime cosplay"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteUrl">Site URL</Label>
                    <Input id="siteUrl" defaultValue="https://animecosu.com" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Branding</CardTitle>
                  <CardDescription>Customize your website's branding</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Site Logo</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                        <Globe className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <Input type="file" id="logo" className="hidden" />
                        <Label htmlFor="logo" className="cursor-pointer">
                          <Button type="button" variant="outline" className="mb-2">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Logo
                          </Button>
                        </Label>
                        <p className="text-xs text-muted-foreground">Recommended size: 200x200 pixels</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Favicon</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <Input type="file" id="favicon" className="hidden" />
                        <Label htmlFor="favicon" className="cursor-pointer">
                          <Button type="button" variant="outline" className="mb-2">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Favicon
                          </Button>
                        </Label>
                        <p className="text-xs text-muted-foreground">Recommended size: 32x32 pixels</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input type="color" id="primaryColor" defaultValue="#ec4899" className="w-12 h-10 p-1" />
                      <Input defaultValue="#ec4899" className="flex-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Social Media</CardTitle>
                  <CardDescription>Connect your social media accounts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input id="instagram" defaultValue="@AnimeCosu" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input id="twitter" defaultValue="@AnimeCosu" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input id="facebook" defaultValue="AnimeCosu" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input id="youtube" defaultValue="AnimeCosuOfficial" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Analytics & SEO</CardTitle>
                  <CardDescription>Configure analytics and search engine optimization</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                    <Input id="googleAnalytics" defaultValue="UA-123456789-1" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Default Meta Title</Label>
                    <Input id="metaTitle" defaultValue="AnimeCosu - Anime Cosplay Community" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Default Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      defaultValue="Discover amazing cosplayers, tutorials, events and more in the world of anime cosplay"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="sitemapEnabled" defaultChecked />
                    <Label htmlFor="sitemapEnabled">Generate sitemap automatically</Label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users & Roles Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage users and their roles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-medium">Admin Users</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage users who have access to the admin dashboard
                      </p>
                    </div>
                    <Button className="ml-auto bg-pink-600 hover:bg-pink-700">Add User</Button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                          <span className="font-medium text-pink-800">AU</span>
                        </div>
                        <div>
                          <p className="font-medium">Admin User</p>
                          <p className="text-sm text-muted-foreground">admin@animecosu.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200">Administrator</Badge>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="font-medium text-blue-800">CM</span>
                        </div>
                        <div>
                          <p className="font-medium">Content Manager</p>
                          <p className="text-sm text-muted-foreground">content@animecosu.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Editor</Badge>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <Shield className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-medium">Roles & Permissions</h3>
                      <p className="text-sm text-muted-foreground">Configure user roles and their permissions</p>
                    </div>
                    <Button variant="outline" className="ml-auto">
                      Add Role
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="p-2 bg-muted/50 rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">Administrator</p>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Full access to all features and settings</p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline">Manage Users</Badge>
                        <Badge variant="outline">Manage Content</Badge>
                        <Badge variant="outline">Manage Settings</Badge>
                        <Badge variant="outline">Manage Files</Badge>
                      </div>
                    </div>

                    <div className="p-2 bg-muted/50 rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">Editor</p>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Can create and edit content, but cannot access settings
                      </p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline">Manage Content</Badge>
                        <Badge variant="outline">Manage Files</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Tab */}
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>Configure email settings and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-md p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <Mail className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-medium">SMTP Configuration</h3>
                      <p className="text-sm text-muted-foreground">Configure your email server settings</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost">SMTP Host</Label>
                      <Input id="smtpHost" defaultValue="smtp.example.com" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input id="smtpPort" defaultValue="587" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtpUser">SMTP Username</Label>
                      <Input id="smtpUser" defaultValue="info@animecosu.com" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">SMTP Password</Label>
                      <Input id="smtpPassword" type="password" defaultValue="••••••••••••" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fromEmail">From Email</Label>
                      <Input id="fromEmail" defaultValue="info@animecosu.com" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fromName">From Name</Label>
                      <Input id="fromName" defaultValue="AnimeCosu" />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button variant="outline">Test Connection</Button>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Email Notifications</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New Contact Form Submission</p>
                        <p className="text-sm text-muted-foreground">
                          Receive an email when someone submits the contact form
                        </p>
                      </div>
                      <Switch id="contactFormNotification" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New Cosplayer Registration</p>
                        <p className="text-sm text-muted-foreground">Receive an email when a new cosplayer registers</p>
                      </div>
                      <Switch id="cosplayerRegistrationNotification" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New Comment</p>
                        <p className="text-sm text-muted-foreground">
                          Receive an email when someone comments on a gallery item
                        </p>
                      </div>
                      <Switch id="commentNotification" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Email Templates</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <div>
                        <p className="font-medium">Contact Form Confirmation</p>
                        <p className="text-sm text-muted-foreground">
                          Sent to users after they submit the contact form
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Edit Template
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <div>
                        <p className="font-medium">Welcome Email</p>
                        <p className="text-sm text-muted-foreground">Sent to new users after registration</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Edit Template
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <div>
                        <p className="font-medium">Password Reset</p>
                        <p className="text-sm text-muted-foreground">Sent to users who request a password reset</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Edit Template
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Configure advanced website settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Cache Settings</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Enable Page Caching</p>
                        <p className="text-sm text-muted-foreground">Cache pages to improve performance</p>
                      </div>
                      <Switch id="pageCaching" defaultChecked />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cacheDuration">Cache Duration (minutes)</Label>
                      <Input id="cacheDuration" type="number" defaultValue="60" />
                    </div>

                    <Button variant="outline">Clear Cache</Button>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">API Settings</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Enable API Access</p>
                        <p className="text-sm text-muted-foreground">
                          Allow external applications to access your data via API
                        </p>
                      </div>
                      <Switch id="apiAccess" defaultChecked />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="apiKey">API Key</Label>
                      <div className="flex gap-2">
                        <Input id="apiKey" defaultValue="sk_live_51JKl2kLkMn3OpQrS" className="flex-1" readOnly />
                        <Button variant="outline">Regenerate</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Security Settings</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Enable HTTPS Redirect</p>
                        <p className="text-sm text-muted-foreground">Automatically redirect HTTP requests to HTTPS</p>
                      </div>
                      <Switch id="httpsRedirect" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Content Security Policy</p>
                        <p className="text-sm text-muted-foreground">Enable Content Security Policy headers</p>
                      </div>
                      <Switch id="csp" defaultChecked />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="allowedOrigins">Allowed Origins (CORS)</Label>
                      <Input id="allowedOrigins" defaultValue="*" />
                      <p className="text-xs text-muted-foreground">
                        Comma-separated list of domains, or * for all domains
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4 border-red-200 bg-red-50">
                  <h3 className="text-lg font-medium mb-4 text-red-800">Danger Zone</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-2 bg-white rounded-md">
                      <div>
                        <p className="font-medium">Export All Data</p>
                        <p className="text-sm text-muted-foreground">Download a backup of all website data</p>
                      </div>
                      <Button variant="outline">Export</Button>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-white rounded-md">
                      <div>
                        <p className="font-medium">Reset Website</p>
                        <p className="text-sm text-muted-foreground">
                          Reset the website to its default state (cannot be undone)
                        </p>
                      </div>
                      <Button variant="destructive">Reset</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  These settings are for advanced users only. Incorrect configuration may affect website functionality.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" className="bg-pink-600 hover:bg-pink-700" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

