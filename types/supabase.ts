export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      cosplayers: {
        Row: {
          id: number
          created_at: string
          name: string
          character: string | null
          bio: string | null
          image: string | null
          tags: string[] | null
          popularity: number | null
          status: string | null
          featured: boolean | null
          location: string | null
          social_links: Json | null
          specialties: string[] | null
          user_id: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          character?: string | null
          bio?: string | null
          image?: string | null
          tags?: string[] | null
          popularity?: number | null
          status?: string | null
          featured?: boolean | null
          location?: string | null
          social_links?: Json | null
          specialties?: string[] | null
          user_id?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          character?: string | null
          bio?: string | null
          image?: string | null
          tags?: string[] | null
          popularity?: number | null
          status?: string | null
          featured?: boolean | null
          location?: string | null
          social_links?: Json | null
          specialties?: string[] | null
          user_id?: string | null
        }
      }
      gallery_items: {
        Row: {
          id: number
          created_at: string
          title: string
          image: string
          cosplayer_id: number | null
          tags: string[] | null
          likes: number | null
          featured: boolean | null
          description: string | null
          photographer: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          title: string
          image: string
          cosplayer_id?: number | null
          tags?: string[] | null
          likes?: number | null
          featured?: boolean | null
          description?: string | null
          photographer?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          title?: string
          image?: string
          cosplayer_id?: number | null
          tags?: string[] | null
          likes?: number | null
          featured?: boolean | null
          description?: string | null
          photographer?: string | null
        }
      }
      events: {
        Row: {
          id: number
          created_at: string
          title: string
          type: string
          location: string
          start_date: string
          end_date: string | null
          image: string | null
          description: string | null
          status: string | null
          featured: boolean | null
        }
        Insert: {
          id?: number
          created_at?: string
          title: string
          type: string
          location: string
          start_date: string
          end_date?: string | null
          image?: string | null
          description?: string | null
          status?: string | null
          featured?: boolean | null
        }
        Update: {
          id?: number
          created_at?: string
          title?: string
          type?: string
          location?: string
          start_date?: string
          end_date?: string | null
          image?: string | null
          description?: string | null
          status?: string | null
          featured?: boolean | null
        }
      }
      messages: {
        Row: {
          id: number
          created_at: string
          name: string
          email: string
          subject: string
          message: string
          status: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          email: string
          subject: string
          message: string
          status?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          email?: string
          subject?: string
          message?: string
          status?: string | null
        }
      }
      pages: {
        Row: {
          id: number
          created_at: string
          title: string
          slug: string
          content: string | null
          meta_title: string | null
          meta_description: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          title: string
          slug: string
          content?: string | null
          meta_title?: string | null
          meta_description?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          title?: string
          slug?: string
          content?: string | null
          meta_title?: string | null
          meta_description?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
      }
      blog_posts: {
        Row: {
          id: number
          created_at: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          featured_image: string | null
          author_id: string | null
          published: boolean
          published_at: string | null
          tags: string[] | null
          category: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          title: string
          slug: string
          content: string
          excerpt?: string | null
          featured_image?: string | null
          author_id?: string | null
          published?: boolean
          published_at?: string | null
          tags?: string[] | null
          category?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          featured_image?: string | null
          author_id?: string | null
          published?: boolean
          published_at?: string | null
          tags?: string[] | null
          category?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

