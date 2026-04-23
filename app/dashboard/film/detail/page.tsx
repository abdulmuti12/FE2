import { Metadata, ResolvingMetadata } from 'next'
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

export async function generateMetadata(
  { searchParams }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
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
      const description =
        meta['og:description'] ||
        meta['twitter:description'] ||
        meta['description'] ||
        meta['keywords'] ||
        ''
      const image = toSecureUrl(meta['og:image'] || meta['twitter:image'] || '')
      const videoUrl = toSecureUrl(meta['og:video'] || meta['twitter:url'] || '')
      const secureVideoUrl = toSecureUrl(meta['og:video:secure_url'] || videoUrl)
      const videoType = meta['og:video:type'] || 'video/mp4'
      const videoWidth = toPositiveNumber(meta['og:video:width'])
      const videoHeight = toPositiveNumber(meta['og:video:height'])
      const author = meta['author']
      const keywords = meta['keywords']
      const twitterCard = image ? 'summary_large_image' : (meta['twitter:card'] || 'summary')
      const twitterSite = meta['twitter:site'] || '@usky'
      const siteName = meta['og:site_name'] || 'USKY'

      return {
        title,
        description,
        keywords,
        ...(author ? { authors: [{ name: author }] } : {}),
        openGraph: {
          siteName,
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
