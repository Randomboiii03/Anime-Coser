import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlaceholderImage } from "@/components/placeholder-image"
import { getFeaturedCosplayers } from "@/lib/api/cosplayers"
import { getFeaturedGalleryItems } from "@/lib/api/gallery"
import { getUpcomingEvents } from "@/lib/api/events"

// Set revalidation time to 15 minutes (900 seconds)
export const revalidate = 900

export default async function Home() {
  const [cosplayers, galleryItems, events] = await Promise.all([
    getFeaturedCosplayers(),
    getFeaturedGalleryItems(),
    getUpcomingEvents(),
  ])

  return (
    <main>
      {/* Hero Section */}
      <section className="relative">
        <div className="w-full h-[600px] relative">
          {/* Hero Image */}
          <div className="absolute inset-0 z-0">
            <PlaceholderImage
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
              alt="Anime cosplay showcase"
            />
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 z-10"></div>

          {/* Content */}
          <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-20 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Bringing Anime Characters to Life</h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Discover amazing cosplayers, get inspired by stunning costumes, and join our vibrant community.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/gallery">Explore Gallery</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/cosplayers">Meet Cosplayers</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cosplayers */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Cosplayers</h2>
            <Button asChild variant="outline">
              <Link href="/cosplayers">View All</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cosplayers.slice(0, 3).map((cosplayer) => (
              <Link key={cosplayer.id} href={`/cosplayers/${cosplayer.id}`}>
                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                  <div className="aspect-[4/3] relative">
                    {cosplayer.profileImage ? (
                      <Image
                        src={cosplayer.profileImage || "/placeholder.svg"}
                        alt={cosplayer.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <PlaceholderImage
                        width={400}
                        height={300}
                        text={cosplayer.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-1">{cosplayer.name}</h3>
                    <p className="text-sm text-muted-foreground">{cosplayer.specialty}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Gallery Items */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Recent Gallery</h2>
            <Button asChild variant="outline">
              <Link href="/gallery">View All</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.slice(0, 3).map((item) => (
              <Link key={item.id} href={`/gallery/${item.id}`}>
                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                  <div className="aspect-[4/3] relative">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                    ) : (
                      <PlaceholderImage
                        width={400}
                        height={300}
                        text={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">By {item.cosplayerName}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <Button asChild variant="outline">
              <Link href="/events">View All</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.slice(0, 2).map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="aspect-square md:aspect-auto relative">
                    {event.imageUrl ? (
                      <Image
                        src={event.imageUrl || "/placeholder.svg"}
                        alt={event.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <PlaceholderImage
                        width={400}
                        height={600}
                        text={event.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <CardContent className="p-6 md:col-span-2">
                    <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-1">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                    <p className="mb-4 line-clamp-2">{event.description}</p>
                    <Button asChild>
                      <Link href={`/events/${event.id}`}>Learn More</Link>
                    </Button>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

