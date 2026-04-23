import { Metadata, ResolvingMetadata } from 'next'
import { headers } from 'next/headers'
import ClipPageClient from './ClipPageClient'

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
    return { title: 'Clip | USKY' }
  }

  try {
    const appBaseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_URL ||
      requestOrigin

    const apiUrl = `${appBaseUrl.replace(/\/$/, '')}/api/movie/meta?id=${encodeURIComponent(id)}`
    console.log('[clip/detail metadata] hit movie/meta', { id, apiUrl })
    const response = await fetch(apiUrl, { cache: 'no-store' })
    const json = await response.json()
    console.log('[clip/detail metadata] movie/meta response', {
      id,
      httpStatus: response.status,
      status: json?.status,
      message: json?.message,
      hasData: typeof json?.data === 'string',
      dataLength: typeof json?.data === 'string' ? json.data.length : 0,
    })

    if (json?.status === true && typeof json?.data === 'string') {
      const meta = parseMetaContent(json.data)
      console.log('[clip/detail metadata] parsed fields', {
        id,
        ogTitle: meta['og:title'] || '',
        hasOgDescription: Boolean(meta['og:description']),
        hasOgImage: Boolean(meta['og:image']),
        twitterTitle: meta['twitter:title'] || '',
        hasTwitterDescription: Boolean(meta['twitter:description']),
        hasTwitterImage: Boolean(meta['twitter:image']),
      })

      const title = meta['og:title'] || meta['twitter:title'] || 'Clip | USKY'
      const description =
        meta['og:description'] ||
        meta['twitter:description'] ||
        meta['Description'] ||
        meta['description'] ||
        meta['keywords'] ||
        ''
      const image = toShareUrl(meta['og:image'] || meta['twitter:image'] || '')
      const videoUrl = toShareUrl(meta['og:video'] || meta['twitter:url'] || '')
      const secureVideoUrl = toShareUrl(meta['og:video:secure_url'] || videoUrl)
      const videoType = meta['og:video:type'] || 'video/mp4'
      const videoWidth = toPositiveNumber(meta['og:video:width'])
      const videoHeight = toPositiveNumber(meta['og:video:height'])
      const author = meta['author'] || meta['Author']
      const keywords = meta['keywords']
      const twitterCard = image ? 'summary_large_image' : (meta['twitter:card'] || 'summary')
      const twitterSite = meta['twitter:site'] || '@usky'
      const siteName = meta['og:site_name'] || 'USKY'
      const pageUrl = `${requestOrigin.replace(/\/$/, '')}/dashboard/clip?id=${encodeURIComponent(id)}`

      return {
        title,
        description,
        ...(description ? { other: { Description: description } } : {}),
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
    console.error('Gagal load metadata clip:', error)
  }

  return { title: 'Clip | USKY' }
}

export default function Page() {
  return <ClipPageClient />
}
