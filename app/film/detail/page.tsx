import { Metadata, ResolvingMetadata } from 'next'
import { headers } from 'next/headers'
import FilmDetailClient from './FilmDetailClient'
import { buildFilmApiUrl } from '@/app/api/film/_utils'

type Props = {
  searchParams: { judul?: string } | Promise<{ judul?: string }>
}

function toSecureUrl(url?: string): string {
  if (!url) return ''
  return url.replace(/^http:\/\//i, 'https://')
}

function toMetaDescription(value?: string): string {
  const plain = String(value || '').replace(/\s+/g, ' ').trim()
  if (!plain) return ''
  if (plain.length <= 100) return plain
  return `${plain.slice(0, 97).trimEnd()}...`
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
  const judul = resolvedSearchParams?.judul

  if (!judul) {
    return { title: 'Film | USKY' }
  }

  try {
    // Langsung fetch detail film (tanpa meta API)
    const detailUrl = `${buildFilmApiUrl('/films/detail')}?judul=${encodeURIComponent(judul)}`
    const detailResponse = await fetch(detailUrl, { cache: 'no-store' })
    const detailJson = await detailResponse.json()

    const film = detailJson?.data
    if (!film) {
      return { title: 'Film Detail | USKY' }
    }

    const filmId = film.id || ''
    const filmName = film.name || 'Film Detail | USKY'
    const filmImage = toSecureUrl(film.image_url || '')
    const filmDescription = toMetaDescription(film.synopsis || film.description || '')
    const filmYear = film.years || ''
    const filmCats = film.cats || ''
    const filmRates = film.rates || ''

    const pageUrl = `${requestOrigin.replace(/\/$/, '')}/film/detail?judul=${encodeURIComponent(judul)}`

    // Buat og:image URL dengan versi cache busting pakai id
    const ogImage = filmImage
      ? `${filmImage}${filmImage.includes('?') ? '&' : '?'}v=${encodeURIComponent(filmId)}`
      : ''

    return {
      title: filmName,
      description: filmDescription,
      alternates: {
        canonical: pageUrl,
      },
      other: {
        Description: filmDescription,
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
        'og:type': 'video.movie',
        'og:release_date': filmYear,
        'og:genre': filmCats,
        'og:rating': filmRates,
      },
      openGraph: {
        siteName: 'USKY',
        url: pageUrl,
        title: filmName,
        description: filmDescription,
        ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
      },
      twitter: {
        card: 'summary_large_image',
        site: '@usky',
        title: filmName,
        description: filmDescription,
        ...(ogImage ? { images: [ogImage] } : {}),
      },
    }
  } catch (error) {
    console.error('Gagal load metadata film:', error)
  }

  return { title: 'Film Detail | USKY' }
}

export default function Page() {
  return <FilmDetailClient />
}
