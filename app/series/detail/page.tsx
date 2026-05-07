// app/series/detail/page.tsx
import { Metadata, ResolvingMetadata } from 'next'
import { headers } from 'next/headers'
import SeriesDetailClient from './SeriesDetailClient'

type Props = {
  searchParams: { id_group?: string; id?: string; judul?: string } | Promise<{ id_group?: string; id?: string; judul?: string }>
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

    if (key && value) {
      map[key] = value
    }
  }

  return map
}

function toPositiveNumber(value?: string): number | undefined {
  if (!value) return undefined
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) return undefined
  return parsed
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
  const idGroup = resolvedSearchParams?.id_group
  const idVideo = resolvedSearchParams?.id

  if (!idGroup && !idVideo) {
    return { title: 'Series | USKY' }
  }

  try {
    const appBaseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_URL ||
      requestOrigin

    // Pakai id_group sebagai identifier utama, fallback ke id
    const identifier = idGroup || idVideo

    // Langsung fetch dari series detail API (tanpa meta API)
    const apiUrl = `${appBaseUrl.replace(/\/$/, '')}/api/series/series-detail?id_group=${encodeURIComponent(identifier || '')}`
    console.log('[series/detail metadata] hit series-detail', { identifier, apiUrl })
    const response = await fetch(apiUrl, { cache: 'no-store' })
    const json = await response.json()
    console.log('[series/detail metadata] series-detail response', {
      identifier: identifier || '',
      httpStatus: response.status,
      status: json?.status,
    })

    const series = json?.data

    if (series) {
      const seriesName = String(series.name || 'Series Detail | USKY')
      const seriesDescription = String(series.description || series.synopsis || '')
      const seriesImage = toSecureUrl(String(series.image_landscape_url || series.image_url || ''))
      const seriesVideoUrl = toSecureUrl(String(series.video_url || ''))

      // Buat og:image URL dengan cache busting
      const ogImage = seriesImage
        ? `${seriesImage}${seriesImage.includes('?') ? '&' : '?'}v=${encodeURIComponent(identifier)}`
        : ''

      const pageUrl = `${requestOrigin.replace(/\/$/, '')}/series/detail?id_group=${encodeURIComponent(identifier)}`

      return {
        title: seriesName,
        description: seriesDescription,
        alternates: {
          canonical: pageUrl,
        },
        other: {
          Description: seriesDescription,
          ...(ogImage
            ? {
                'og:image': ogImage,
                'og:image:secure_url': ogImage,
                'og:image:type': 'image/jpeg',
                'og:image:width': '1200',
                'og:image:height': '630',
                'twitter:image:src': ogImage,
              }
            : {}),
          'og:type': 'video.tv_show',
          'og:release_date': series.years || '',
          'og:genre': series.cats || '',
        },
        openGraph: {
          siteName: 'USKY',
          url: pageUrl,
          title: seriesName,
          description: seriesDescription,
          ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
          ...(seriesVideoUrl
            ? {
                videos: [
                  {
                    url: seriesVideoUrl,
                    type: 'video/mp4',
                  },
                ],
              }
            : {}),
        },
        twitter: {
          card: 'summary_large_image',
          site: '@usky',
          title: seriesName,
          description: seriesDescription,
          ...(ogImage ? { images: [ogImage] } : {}),
        },
      }
    }
  } catch (error) {
    console.error('Gagal load metadata series:', error)
  }

  return { title: 'Series Detail | USKY' }
}

export default function Page() {
  return <SeriesDetailClient />
}
