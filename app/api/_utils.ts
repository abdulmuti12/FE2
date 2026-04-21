const getApiBaseUrl = (): string => {
  const baseUrl =
    process.env.USKY_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'https://api.usky.ai'

  const normalized = baseUrl.trim().replace(/\/+$/, '')
  return normalized || 'https://api.usky.ai'
}

export const buildApiUrl = (pathOrUrl: string): string => {
  const base = getApiBaseUrl()

  if (/^https?:\/\//i.test(pathOrUrl)) {
    const parsed = new URL(pathOrUrl)
    return `${base}${parsed.pathname}${parsed.search}`
  }

  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${base}${path}`
}
