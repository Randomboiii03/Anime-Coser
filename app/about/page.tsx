import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Facebook, Instagram, Mail, Twitter, Youtube } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About AnimeCosu</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Learn about our mission, our team, and our passion for bringing the anime cosplay community together.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-4">
            AnimeCosu was founded in 2018 with a simple mission: to create a vibrant online community that celebrates
            the art, creativity, and passion of anime cosplay.
          </p>
          <p className="text-muted-foreground mb-4">
            We believe that cosplay is more than just dressing up—it's a form of artistic expression, a way to honor
            beloved characters, and a means to connect with like-minded fans from around the world.
          </p>
          <p className="text-muted-foreground mb-6">
            Through our platform, we aim to showcase talented cosplayers, provide valuable resources and tutorials,
            highlight exciting events, and foster a supportive community where everyone—from beginners to
            professionals—can share their love for anime and cosplay.
          </p>
          <div className="flex gap-4">
            <Button className="bg-pink-600 hover:bg-pink-700">Join Our Community</Button>
            <Button variant="outline">Contact Us</Button>
          </div>
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image src="/placeholder.svg?height=800&width=600" alt="Cosplay Community" fill className="object-cover" />
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-64">
                <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-pink-600 mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>
                <div className="flex justify-center gap-3">
                  <Button variant="ghost" size="icon" className="text-blue-600">
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-pink-600">
                    <Instagram className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Mail className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Our Story */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
        <Tabs defaultValue="beginning" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="beginning">The Beginning</TabsTrigger>
            <TabsTrigger value="growth">Growth & Evolution</TabsTrigger>
            <TabsTrigger value="today">AnimeCosu Today</TabsTrigger>
          </TabsList>
          <TabsContent value="beginning" className="p-6 bg-muted rounded-lg">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">2018: Where It All Started</h3>
                <p className="text-muted-foreground mb-4">
                  AnimeCosu began as a small blog run by a group of friends who shared a passion for anime cosplay. What
                  started as a hobby quickly grew as more cosplayers discovered our platform and wanted to share their
                  creations.
                </p>
                <p className="text-muted-foreground">
                  Our first online gallery featured just 20 cosplayers, and our first event coverage was a local
                  convention with about 500 attendees. Little did we know that this humble beginning would evolve into
                  something much bigger.
                </p>
              </div>
              <div className="relative h-[300px] rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="AnimeCosu Beginning"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="growth" className="p-6 bg-muted rounded-lg">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative h-[300px] rounded-lg overflow-hidden md:order-first">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="AnimeCosu Growth"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">2020-2022: Expanding Our Reach</h3>
                <p className="text-muted-foreground mb-4">
                  By 2020, our community had grown to include thousands of cosplayers from over 50 countries. We
                  expanded our content to include in-depth tutorials, interviews with professional cosplayers, and
                  comprehensive event coverage.
                </p>
                <p className="text-muted-foreground">
                  In 2021, we launched our first online cosplay competition, which attracted over 500 participants. The
                  following year, we partnered with major anime conventions to provide exclusive coverage and
                  behind-the-scenes content.
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="today" className="p-6 bg-muted rounded-lg">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">2023: AnimeCosu Today</h3>
                <p className="text-muted-foreground mb-4">
                  Today, AnimeCosu is one of the leading platforms for anime cosplay enthusiasts worldwide. Our
                  community includes over 50,000 registered cosplayers, and our gallery features more than 100,000
                  cosplay photos.
                </p>
                <p className="text-muted-foreground">
                  We've expanded our team to include professional photographers, writers, and event coordinators who are
                  dedicated to showcasing the best of anime cosplay. Our mission remains the same: to celebrate
                  creativity, foster community, and inspire the next generation of cosplayers.
                </p>
              </div>
              <div className="relative h-[300px] rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="AnimeCosu Today"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Community Stats */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Our Community by the Numbers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="text-center p-6">
            <h3 className="text-4xl font-bold text-pink-600 mb-2">50K+</h3>
            <p className="text-muted-foreground">Registered Cosplayers</p>
          </Card>
          <Card className="text-center p-6">
            <h3 className="text-4xl font-bold text-pink-600 mb-2">100K+</h3>
            <p className="text-muted-foreground">Cosplay Photos</p>
          </Card>
          <Card className="text-center p-6">
            <h3 className="text-4xl font-bold text-pink-600 mb-2">200+</h3>
            <p className="text-muted-foreground">Events Covered</p>
          </Card>
          <Card className="text-center p-6">
            <h3 className="text-4xl font-bold text-pink-600 mb-2">80+</h3>
            <p className="text-muted-foreground">Countries Represented</p>
          </Card>
        </div>
      </div>

      {/* Connect With Us */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-6">Connect With Us</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Follow us on social media to stay updated on the latest cosplay trends, events, and community highlights.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" size="lg" className="gap-2">
            <Instagram className="h-5 w-5" />
            Instagram
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            <Twitter className="h-5 w-5" />
            Twitter
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            <Facebook className="h-5 w-5" />
            Facebook
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            <Youtube className="h-5 w-5" />
            YouTube
          </Button>
        </div>
      </div>
    </div>
  )
}

// Sample data
const teamMembers = [
  {
    id: 1,
    name: "Yuki Tanaka",
    role: "Founder & Creative Director",
    image: "/placeholder.svg?height=400&width=300",
    bio: "Professional cosplayer with 10+ years of experience and a passion for bringing anime characters to life.",
  },
  {
    id: 2,
    name: "Alex Chen",
    role: "Content Manager",
    image: "/placeholder.svg?height=400&width=300",
    bio: "Writer, photographer, and cosplay enthusiast responsible for curating our blog content and tutorials.",
  },
  {
    id: 3,
    name: "Maria Rodriguez",
    role: "Community Manager",
    image: "/placeholder.svg?height=400&width=300",
    bio: "Dedicated to fostering a supportive community and connecting cosplayers from around the world.",
  },
  {
    id: 4,
    name: "Kenji Watanabe",
    role: "Event Coordinator",
    image: "/placeholder.svg?height=400&width=300",
    bio: "Experienced event planner who manages our convention coverage and organizes cosplay meetups.",
  },
]

