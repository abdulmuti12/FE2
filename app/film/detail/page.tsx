import { Metadata, ResolvingMetadata } from 'next'
import { headers } from 'next/headers'
import FilmDetailClient from './FilmDetailClient'
import { buildFilmApiUrl } from '@/app/api/film/_utils'

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

function toMetaDescription(value?: string): string {
  const plain = String(value || '').replace(/\s+/g, ' ').trim()
  if (!plain) return ''
  if (plain.length <= 100) return plain
  return `${plain.slice(0, 97).trimEnd()}...`
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
    return { title: 'Film | USKY' }
  }

  try {
    const apiUrl = `${buildFilmApiUrl('/films/meta')}?id=${encodeURIComponent(id)}`
    const response = await fetch(apiUrl, { cache: 'no-store' })
    const json = await response.json()

    if (json?.status === true && typeof json?.data === 'string') {
      const meta = parseMetaContent(json.data)

      const title = meta['og:title'] || meta['twitter:title'] || 'Film Detail | USKY'
      const description = toMetaDescription(
        meta['og:description'] ||
          meta['twitter:description'] ||
          meta['Description'] ||
          meta['description'] ||
          meta['keywords'] ||
          ''
      )
      const image = toCrawlerSafeImageUrl(meta['og:image'] || meta['twitter:image'] || '', id)
      const videoUrl = toShareUrl(meta['og:video'] || meta['twitter:url'] || '')
      const secureVideoUrl = toShareUrl(meta['og:video:secure_url'] || videoUrl)
      const videoType = meta['og:video:type'] || 'video/mp4'
      const videoWidth = toPositiveNumber(meta['og:video:width'])
      const videoHeight = toPositiveNumber(meta['og:video:height'])
      const author = meta['author']
      const keywords = meta['keywords']
      const twitterCard = image ? 'summary_large_image' : (meta['twitter:card'] || 'summary')
      const twitterSite = meta['twitter:site'] || '@usky'
      const siteName = meta['og:site_name'] || 'USKY'
      const pageUrl = `${requestOrigin.replace(/\/$/, '')}/film/detail?id=${encodeURIComponent(id)}`

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
                      'og:image:type': 'image/jpeg',
                      'og:image:width': '1200',
                      'og:image:height': '630',
                      'twitter:image:src': image,
                    }
                  : {}),
              },
            }
          : {}),
        keywords,
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
    console.error('Gagal load metadata film:', error)
  }

  return { title: 'Film Detail | USKY' }
}

export default function Page() {
  return <FilmDetailClient />
}
