// app/series/detail/page.tsx
import { Metadata, ResolvingMetadata } from 'next'
import { headers } from 'next/headers'
import SeriesDetailClient from './SeriesDetailClient'
import { buildApiUrl } from '@/app/api/_utils'

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
    // Pakai id_group sebagai identifier utama, fallback ke id
    const identifier = idGroup || idVideo

    // Flow seperti film: hit upstream detail-group, lalu metagroup.
    const baseIdentifier = String(identifier || '').trim()
    let detailIdentifier = baseIdentifier
    let detailUrl = `${buildApiUrl('/series/detail-group')}?id_group=${encodeURIComponent(detailIdentifier)}`
    console.log('[series/detail metadata] hit series-detail upstream', { identifier: detailIdentifier, detailUrl })
    let response = await fetch(detailUrl, { cache: 'no-store' })
    let json = await response.json()

    if ((!response.ok || json?.status !== true || !json?.data) && detailIdentifier && !detailIdentifier.includes('-part-')) {
      detailIdentifier = `${detailIdentifier}-part-1`
      detailUrl = `${buildApiUrl('/series/detail-group')}?id_group=${encodeURIComponent(detailIdentifier)}`
      console.log('[series/detail metadata] fallback hit series-detail upstream', { identifier: detailIdentifier, detailUrl })
      response = await fetch(detailUrl, { cache: 'no-store' })
      json = await response.json()
    }
    console.log('[series/detail metadata] series-detail response', {
      identifier: identifier || '',
      httpStatus: response.status,
      status: json?.status,
    })

    const isDetailGroupSuccess = response.ok && json?.status === true && Boolean(json?.data)
    const series = json?.data
    const judulForMeta = String(series?.jud_url || detailIdentifier || baseIdentifier || '').trim()
    let titleFromMeta = ''

    if (judulForMeta) {
      const metaUrl = `${buildApiUrl('/series/meta')}?judul=${encodeURIComponent(judulForMeta)}`
      console.log('[series/detail metadata] hit series/meta upstream', {
        judulForMeta,
        metaUrl,
        detailGroupSuccess: isDetailGroupSuccess,
      })

      const metaResponse = await fetch(metaUrl, { cache: 'no-store' })
      const metaJson = await metaResponse.json()
      const metaRaw = typeof metaJson?.data === 'string' ? metaJson.data : ''
      const parsedMeta = metaRaw ? parseMetaContent(metaRaw) : {}
      titleFromMeta = parsedMeta['og:title'] || parsedMeta['twitter:title'] || ''
    } else {
      console.log('ga ke hit metanya')
    }

    if (series) {
      const seriesName = String(titleFromMeta || series.name || 'Series Detail | USKY')
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
