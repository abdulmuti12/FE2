// app/dashboard/series/detail/page.tsx
import { Metadata, ResolvingMetadata } from 'next'
import SeriesDetailClient from './SeriesDetailClient'

type Props = {
  searchParams: { id_group?: string }
}

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id_group = searchParams.id_group

  if (!id_group) {
    return { title: 'Series | USKY' }
  }

  try {
    // Fetch API dari backend untuk meta
    const apiUrl = `http://72.60.78.152:3001/api/series/series-detail?id_group=${id_group}`
    const response = await fetch(apiUrl, { cache: 'no-store' })
    const json = await response.json()

    if (json.status === true && json.data) {
      const data = json.data
      
      // Hilangkan tag HTML dari deskripsi
      const plainDesc = data.description?.replace(/<[^>]+>/g, '').trim() || ''
      const imageUrl = data.image_landscape_url || data.image_url || ''
      const videoUrl = data.video_url || ''

      return {
        title: data.name,
        description: plainDesc,
        keywords: plainDesc, 
        authors: [{ name: 'USKY' }],
        openGraph: {
          siteName: 'USKY',
          title: data.name,
          description: plainDesc,
          images: [
            {
              url: imageUrl,
            },
          ],
          videos: [
            {
              url: videoUrl,
              secureUrl: videoUrl,
              type: 'video/mp4',
              width: 500,
              height: 280,
            }
          ]
        },
        twitter: {
          card: 'summary',
          site: '@usky',
          title: data.name,
          description: plainDesc,
          images: [imageUrl],
        },
      }
    }
  } catch (error) {
    console.error("Gagal load metadata:", error)
  }

  // Fallback jika API gagal
  return { title: 'Series Detail | USKY' }
}

export default function Page() {
  return <SeriesDetailClient />
}