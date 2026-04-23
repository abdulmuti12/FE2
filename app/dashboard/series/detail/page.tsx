// app/dashboard/series/detail/page.tsx
import { Metadata, ResolvingMetadata } from 'next'
import SeriesDetailClient from './SeriesDetailClient'
import { buildApiUrl } from '@/app/api/_utils'

type Props = {
  searchParams:
    | { id_group?: string; id?: string }
    | Promise<{ id_group?: string; id?: string }>
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

function toPlainText(input?: string): string {
  if (!input) return ''
  return input.replace(/<[^>]+>/g, '').replace(/&nbsp;/gi, ' ').trim()
}

export async function generateMetadata(
  { searchParams }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedSearchParams = await Promise.resolve(searchParams)
  const idGroup = resolvedSearchParams?.id_group || resolvedSearchParams?.id

  if (!idGroup) {
    return { title: 'Series | USKY' }
  }

  try {
    const appBaseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_URL ||
      'http://localhost:3000'
    const pageUrl = `${appBaseUrl.replace(/\/$/, '')}/dashboard/series/detail?id_group=${encodeURIComponent(idGroup)}`

    const apiUrl = `${buildApiUrl('/series/meta')}?id=${encodeURIComponent(idGroup)}`
    const response = await fetch(apiUrl, { cache: 'no-store' })
    const json = await response.json()

    if (json?.status === true && typeof json?.data === 'string') {
      const meta = parseMetaContent(json.data)

      let title = meta['og:title'] || meta['twitter:title'] || 'Series Detail | USKY'
      let description =
        meta['og:description'] ||
        meta['twitter:description'] ||
        meta['Description'] ||
        meta['description'] ||
        meta['keywords'] ||
        ''
      let image = toSecureUrl(meta['og:image'] || meta['twitter:image'] || '')
      const videoUrl = toSecureUrl(meta['og:video'] || meta['twitter:url'] || '')
      const secureVideoUrl = toSecureUrl(meta['og:video:secure_url'] || videoUrl)
      const videoType = meta['og:video:type'] || 'video/mp4'
      const videoWidth = toPositiveNumber(meta['og:video:width'])
      const videoHeight = toPositiveNumber(meta['og:video:height'])
      const author = meta['author']
      let keywords = meta['keywords']
      const twitterCard = image ? 'summary_large_image' : (meta['twitter:card'] || 'summary')
      const twitterSite = meta['twitter:site'] || '@usky'
      const siteName = meta['og:site_name'] || 'USKY'

      // Fallback: jika endpoint /series/meta tidak lengkap, isi dari series detail.
      if (!image || !description) {
        const detailUrl = `${buildApiUrl('/series/detail-group')}?id_group=${encodeURIComponent(idGroup)}`
        const detailResponse = await fetch(detailUrl, { cache: 'no-store' })
        const detailJson = await detailResponse.json()

        if (detailJson?.status === true && detailJson?.data) {
          const detail = detailJson.data
          title = title || detail.name || 'Series Detail | USKY'
          description = description || toPlainText(detail.description)
          keywords = keywords || toPlainText(detail.description)
          image =
            image ||
            toSecureUrl(detail.image_landscape_url || detail.image_url || '')
        }
      }

      description = toPlainText(description)
      keywords = toPlainText(keywords || description)

      return {
        title,
        description,
        ...(description ? { other: { Description: description } } : {}),
        keywords,
        alternates: {
          canonical: pageUrl,
        },
        ...(author ? { authors: [{ name: author }] } : {}),
        openGraph: {
          siteName,
          url: pageUrl,
          title,
          description,
          ...(image ? { images: [{ url: image }] } : {}),
          ...(videoUrl
            ? {
                videos: [
                  {
                    url: videoUrl,
                    secureUrl: secureVideoUrl,
                    type: videoType,
                    ...(videoWidth ? { width: videoWidth } : {}),
                    ...(videoHeight ? { height: videoHeight } : {}),
                  },
                ],
              }
            : {}),
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
    console.error('Gagal load metadata series:', error)
  }

  return { title: 'Series Detail | USKY' }
}

export default function Page() {
  return <SeriesDetailClient />
}
