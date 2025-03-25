import { getCosplayers } from "@/lib/api/cosplayers"
import CosplayersClient from "./cosplayers-client"

export const revalidate = 3600 // Revalidate every hour

export default async function CosplayersPage() {
  const cosplayers = await getCosplayers()

  return <CosplayersClient initialCosplayers={cosplayers} />
}

