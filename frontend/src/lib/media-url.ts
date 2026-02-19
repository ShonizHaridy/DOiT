const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:4000/api'

const ABSOLUTE_URL_RE = /^https?:\/\//i
const SPECIAL_URL_RE = /^(data|blob):/i

export const toAbsoluteMediaUrl = (value?: string | null): string => {
  if (!value || typeof value !== 'string') return ''

  const url = value.trim()
  if (!url) return ''
  if (ABSOLUTE_URL_RE.test(url) || SPECIAL_URL_RE.test(url) || url.startsWith('//')) {
    return url
  }

  const normalizedPath = url.startsWith('/') ? url : `/${url}`

  try {
    const base = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`
    return new URL(normalizedPath, base).toString()
  } catch {
    return normalizedPath
  }
}
