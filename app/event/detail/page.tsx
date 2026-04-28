import { Suspense } from 'react'
import { Metadata, ResolvingMetadata } from 'next'
import { headers } from 'next/headers'
import EventDetailClient from './EventDetailClient'

type Props = {
  searchParams: { id?: string } | Promise<{ id?: string }>
}

type MetaTagMap = Record<string, string>

function parseMetaContent(metaHtml: string): MetaTagMap {
  const map: MetaTagMap = {}
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
    const value = attrMap.content

    if (key && value !== undefined) {
      map[key] = value
    }
  }

  return map
}

function toSecureUrl(url?: string): string {
  if (!url) return ''
  return url.replace(/^http:\/\//i, 'https://')
}

function toShareUrl(url?: string): string {
  if (!url) return ''
  const secureUrl = toSecureUrl(url).trim()
  if (!secureUrl) return ''
  try {
    return encodeURI(secureUrl)
  } catch {
    return secureUrl
  }
}

function toCrawlerSafeImageUrl(url?: string, version?: string): string {
  const strictEncode = (value: string) =>
    encodeURIComponent(value).replace(/[!'()*]/g, (char) =>
      `%${char.charCodeAt(0).toString(16).toUpperCase()}`
    )

  if (!url) return ''
  try {
    const parsed = new URL(toSecureUrl(url))
    const encodedPath = parsed.pathname
      .split('/')
      .map((segment) => {
        if (!segment) return segment
        try {
          return strictEncode(decodeURIComponent(segment))
        } catch {
          return strictEncode(segment)
        }
      })
      .join('/')

    parsed.pathname = encodedPath

    if (version) {
      parsed.searchParams.set('v', version)
    }

    return parsed.toString()
  } catch {
    return toShareUrl(url)
  }
}

function detectImageMimeType(url?: string): string {
  const normalized = String(url || '').toLowerCase()
  if (normalized.includes('.png')) return 'image/png'
  if (normalized.includes('.webp')) return 'image/webp'
  if (normalized.includes('.gif')) return 'image/gif'
  if (normalized.includes('.svg')) return 'image/svg+xml'
  return 'image/jpeg'
}

export async function generateMetadata(
  { searchParams }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const requestHeaders = await headers()
  const proto = requestHeaders.get('x-forwarded-proto') || 'https'
  const hostHeader =
    requestHeaders.get('x-forwarded-host') ||
    requestHeaders.get('host') ||
    'usky.ai'
  const host = hostHeader.split(',')[0].trim() || 'usky.ai'
  const requestOrigin = `${proto}://${host}`

  const resolvedSearchParams = await Promise.resolve(searchParams)
  const id = resolvedSearchParams?.id

  if (!id) {
    return { title: 'Event Detail | USKY' }
  }

  try {
    const appBaseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_URL ||
      requestOrigin

    const apiUrl = `${appBaseUrl.replace(/\/$/, '')}/api/event/meta?id=${encodeURIComponent(id)}`
    const response = await fetch(apiUrl, { cache: 'no-store' })
    const json = await response.json()

    if (json?.status === true && typeof json?.data === 'string') {
      const meta = parseMetaContent(json.data)
      const title = meta['og:title'] || meta['twitter:title'] || 'Event Detail | USKY'
      const description =
        meta['og:description'] ||
        meta['twitter:description'] ||
        meta['Description'] ||
        meta['description'] ||
        meta['keywords'] ||
        ''
      const fallbackImage = `${requestOrigin.replace(/\/$/, '')}/og-image.png`
      const image =
        toCrawlerSafeImageUrl(meta['og:image'] || meta['twitter:image'] || '', id) ||
        fallbackImage
      const twitterCard = image ? 'summary_large_image' : (meta['twitter:card'] || 'summary')
      const twitterSite = meta['twitter:site'] || '@usky'
      const siteName = meta['og:site_name'] || 'USKY'
      const pageUrl = `${requestOrigin.replace(/\/$/, '')}/event/detail?id=${encodeURIComponent(id)}`
      const imageType = detectImageMimeType(image)

      return {
        title,
        description,
        alternates: {
          canonical: pageUrl,
        },
        ...(description || image
          ? {
              other: {
                ...(description ? { Description: description } : {}),
                ...(image
                  ? {
                      'og:image:secure_url': image,
                      'og:image:type': imageType,
                      'og:image:width': '1200',
                      'og:image:height': '630',
                      'twitter:image:src': image,
                    }
                  : {}),
              },
            }
          : {}),
        keywords: meta['keywords'],
        ...(meta['author'] || meta['Author'] ? { authors: [{ name: meta['author'] || meta['Author'] }] } : {}),
        openGraph: {
          type: 'website',
          siteName,
          url: pageUrl,
          title,
          description,
          ...(image ? { images: [{ url: image, width: 1200, height: 630, type: imageType }] } : {}),
        },
        twitter: {
          card: twitterCard as any,
          site: twitterSite,
          title,
          description,
          ...(image ? { images: [image] } : {}),
        },
      }
    }
  } catch (error) {
    console.error('Gagal load metadata event:', error)
  }

  return { title: 'Event Detail | USKY' }
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050B14] flex items-center justify-center"><div className="animate-pulse text-white">Loading...</div></div>}>
      <EventDetailClient />
    </Suspense>
  )
}
