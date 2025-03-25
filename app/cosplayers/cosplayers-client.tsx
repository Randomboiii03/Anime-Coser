"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { PlaceholderImage } from "@/components/placeholder-image"

export type Cosplayer = {
  id: number
  name: string
  profileImage: string
  specialty: string
  popularity: number
}

interface CosplayersClientProps {
  initialCosplayers: Cosplayer[]
}

export function CosplayersClient({ initialCosplayers }: CosplayersClientProps) {
  const [cosplayers] = useState<Cosplayer[]>(initialCosplayers)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cosplayers.map((cosplayer) => (
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
  )
}

