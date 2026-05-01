import { Metadata, ResolvingMetadata } from 'next'
import EventDetailClient from './EventDetailClient'

type Props = {
  searchParams: { id?: string } | Promise<{ id?: string }>
}

// Fungsi sederhana untuk parse HTML string dari API ke Object
function parseMetaContent(metaHtml: string): Record<string, string> {
  const map: Record<string, string> = {}
  const metaTagRegex = /<meta\s+([^>]*?)\/?\s*>/gi

  let tagMatch: RegExpExecArray | null
  while ((tagMatch = metaTagRegex.exec(metaHtml)) !== null) {
    const attrs = tagMatch[1]
    const attrMap: Record<string, string> = {}
    const attrRegex = /([:\w-]+)\s*=\s*"([^"]*)"/g

    let attrMatch: RegExpExecArray | null
    while ((attrMatch = attrRegex.exec(attrs)) !== null) {
      attrMap[attrMatch[1].toLowerCase()] = attrMatch[2]
    }

    const key = attrMap.property || attrMap.name
    if (key && attrMap.content !== undefined) {
      map[key] = attrMap.content
    }
  }

  return map
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  // Tunggu searchParams selesai di-resolve (wajib di Next.js 14/15)
  const resolvedParams = await Promise.resolve(searchParams)
  const id = resolvedParams?.id

  if (!id) {
    return { title: 'Event Detail | USKY' }
  }

  try {
    // Pastikan env NEXT_PUBLIC_APP_URL tersetting (contoh: https://usky.ai)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://usky.ai'
    const apiUrl = `${baseUrl}/api/event/meta?id=${encodeURIComponent(id)}`
    
    // Panggil API di sisi server
    const response = await fetch(apiUrl, { cache: 'no-store' })
    const json = await response.json()

    if (json?.status === true && typeof json?.data === 'string') {
      const meta = parseMetaContent(json.data)
      
      const title = meta['og:title'] || meta['twitter:title'] || 'Event Detail | USKY'
      const description = meta['og:description'] || meta['twitter:description'] || meta['description'] || ''
      const image = meta['og:image'] || meta['twitter:image'] || `${baseUrl}/og-image.png`

      return {
        metadataBase: new URL(baseUrl), // Membantu meresolve URL relatif menjadi absolut
        title,
        description,
        openGraph: {
          title,
          description,
          images: [
            {
              url: image, // Next.js otomatis akan mengenali absolute URL
              width: 1200,
              height: 630,
            }
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [image],
        }
      }
    }
  } catch (error) {
    console.error('Gagal load metadata event di server:', error)
  }

  return { title: 'Event Detail | USKY' }
}

export default function Page() {
  // Render tampilan Client setelah Metadata server selesai dibuat
  return <EventDetailClient />
}