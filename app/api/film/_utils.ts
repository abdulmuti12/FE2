export const getFilmApiBaseUrl = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim()

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured')
  }

  return baseUrl.replace(/\/+$/, '')
}

export const buildFilmApiUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${getFilmApiBaseUrl()}${normalizedPath}`
}
