"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import { Loader2, Save, Upload, User } from "lucide-react"

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    username: "",
    display_name: "",
    bio: "",
    website: "",
    avatar_url: "",
  })

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  // Load profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        display_name: profile.display_name || "",
        bio: profile.bio || "",
        website: profile.website || "",
        avatar_url: profile.avatar_url || "",
      })
    }
  }, [profile])

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingAvatar(true)

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop()
      const fileName = `${user?.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage.from("profiles").upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("profiles").getPublicUrl(filePath)

      // Update form data
      setFormData({
        ...formData,
        avatar_url: publicUrl,
      })
    } catch (error: any) {
      console.error("Error uploading avatar:", error)
      setError("Failed to upload avatar. Please try again.")
    } finally {
      setUploadingAvatar(false)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username: formData.username,
          display_name: formData.display_name,
          bio: formData.bio,
          website: formData.website,
          avatar_url: formData.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id)

      if (error) {
        throw error
      }

      setSuccess("Profile updated successfully!")
    } catch (error: any) {
      console.error("Error updating profile:", error)
      setError(error.message || "Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12">
        <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

        <Tabs defaultValue="profile" className="mb-6">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your profile information and public details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}
                  {success && <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">{success}</div>}

                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex flex-col items-center gap-4">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={formData.avatar_url || ""} alt={formData.display_name} />
                        <AvatarFallback className="text-2xl">
                          <User className="h-12 w-12" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Input
                          id="avatar"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                        <Label
                          htmlFor="avatar"
                          className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        >
                          {uploadingAvatar ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Avatar
                            </>
                          )}
                        </Label>
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          name="username"
                          placeholder="your_username"
                          value={formData.username}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="display_name">Display Name</Label>
                        <Input
                          id="display_name"
                          name="display_name"
                          placeholder="Your Name"
                          value={formData.display_name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      placeholder="Tell us about yourself"
                      rows={4}
                      value={formData.bio}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      placeholder="https://your-website.com"
                      value={formData.website}
                      onChange={handleChange}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="bg-pink-600 hover:bg-pink-700" disabled={isLoading}>
                    {isLoading ? (
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
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <div className="flex items-center gap-2">
                    <Input value={user.email} disabled />
                    <Badge>Verified</Badge>
                  </div>
                </div>

                <div className="pt-4">
                  <Button variant="outline" onClick={() => router.push("/change-password")}>
                    Change Password
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4">
                <div className="text-sm text-muted-foreground">
                  Need to leave? You can delete your account and all associated data.
                </div>
                <Button variant="destructive" onClick={() => confirm("Are you sure you want to delete your account?")}>
                  Delete Account
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button variant="ghost" onClick={() => signOut()}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}

