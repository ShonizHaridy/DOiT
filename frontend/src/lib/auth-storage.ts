import type { AuthResponse } from '@/types/auth'

type AuthRole = 'customer' | 'admin'
type AdminLevel = 'SUPER_ADMIN' | 'ADMIN'

type PersistedAuthState = {
  state?: {
    accessToken?: unknown
    user?: unknown
  }
}

type PersistedUser = AuthResponse['user']

type AuthSnapshot = {
  token: string | null
  user: PersistedUser | null
  role: AuthRole | null
  adminLevel: AdminLevel | null
}

export const CUSTOMER_AUTH_STORAGE_KEY = 'doit-auth'
export const ADMIN_AUTH_STORAGE_KEY = 'doit-admin-auth'
export const CUSTOMER_LEGACY_TOKEN_KEY = 'access_token'
export const ADMIN_TOKEN_STORAGE_KEY = 'admin_access_token'

const isPersistedUser = (value: unknown): value is PersistedUser => {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Record<string, unknown>
  const role = candidate.role
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.email === 'string' &&
    (role === 'customer' || role === 'admin') &&
    (candidate.adminLevel === undefined ||
      candidate.adminLevel === 'SUPER_ADMIN' ||
      candidate.adminLevel === 'ADMIN')
  )
}

export const decodeJwtPayload = (token?: string | null): Record<string, unknown> | null => {
  if (!token) return null

  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    const decoded = atob(padded)
    return JSON.parse(decoded) as Record<string, unknown>
  } catch {
    return null
  }
}

export const decodeJwtRole = (token?: string | null): AuthRole | null => {
  const payload = decodeJwtPayload(token)
  const role = payload?.role
  return role === 'admin' || role === 'customer' ? role : null
}

export const decodeJwtAdminLevel = (token?: string | null): AdminLevel | null => {
  const payload = decodeJwtPayload(token)
  const adminLevel = payload?.adminLevel
  return adminLevel === 'SUPER_ADMIN' || adminLevel === 'ADMIN' ? adminLevel : null
}

const readPersistedSnapshot = (storageKey: string): AuthSnapshot => {
  if (typeof window === 'undefined') {
    return { token: null, user: null, role: null, adminLevel: null }
  }

  const raw = localStorage.getItem(storageKey)
  if (!raw) {
    return { token: null, user: null, role: null, adminLevel: null }
  }

  try {
    const parsed = JSON.parse(raw) as PersistedAuthState
    const token =
      typeof parsed?.state?.accessToken === 'string' && parsed.state.accessToken.trim().length > 0
        ? parsed.state.accessToken
        : null
    const user = isPersistedUser(parsed?.state?.user) ? parsed.state.user : null
    const role = user?.role ?? decodeJwtRole(token)
    const adminLevel = user?.adminLevel ?? decodeJwtAdminLevel(token)
    return { token, user, role, adminLevel }
  } catch {
    return { token: null, user: null, role: null, adminLevel: null }
  }
}

export const getCustomerAuthSnapshot = (): AuthSnapshot => {
  if (typeof window === 'undefined') {
    return { token: null, user: null, role: null, adminLevel: null }
  }

  const persisted = readPersistedSnapshot(CUSTOMER_AUTH_STORAGE_KEY)
  if (persisted.token && persisted.role === 'customer') {
    return {
      ...persisted,
      adminLevel: null,
    }
  }

  const legacyToken = localStorage.getItem(CUSTOMER_LEGACY_TOKEN_KEY)
  if (legacyToken && decodeJwtRole(legacyToken) === 'customer') {
    return {
      token: legacyToken,
      user: persisted.user?.role === 'customer' ? persisted.user : null,
      role: 'customer',
      adminLevel: null,
    }
  }

  return { token: null, user: null, role: null, adminLevel: null }
}

export const getAdminAuthSnapshot = (): AuthSnapshot => {
  if (typeof window === 'undefined') {
    return { token: null, user: null, role: null, adminLevel: null }
  }

  const persisted = readPersistedSnapshot(ADMIN_AUTH_STORAGE_KEY)
  if (persisted.token && persisted.role === 'admin') {
    return persisted
  }

  const adminToken = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)
  if (adminToken && decodeJwtRole(adminToken) === 'admin') {
    return {
      token: adminToken,
      user: persisted.user?.role === 'admin' ? persisted.user : null,
      role: 'admin',
      adminLevel:
        (persisted.user?.role === 'admin' ? persisted.user?.adminLevel : null) ??
        decodeJwtAdminLevel(adminToken),
    }
  }

  const legacyToken = localStorage.getItem(CUSTOMER_LEGACY_TOKEN_KEY)
  if (legacyToken && decodeJwtRole(legacyToken) === 'admin') {
    return {
      token: legacyToken,
      user: persisted.user?.role === 'admin' ? persisted.user : null,
      role: 'admin',
      adminLevel:
        (persisted.user?.role === 'admin' ? persisted.user?.adminLevel : null) ??
        decodeJwtAdminLevel(legacyToken),
    }
  }

  return { token: null, user: null, role: null, adminLevel: null }
}

export const persistAdminAuth = (data: AuthResponse) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(
    ADMIN_AUTH_STORAGE_KEY,
    JSON.stringify({
      state: {
        accessToken: data.accessToken,
        user: data.user,
      },
      version: 0,
    })
  )
  localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, data.accessToken)
}

export const clearAdminAuthStorage = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY)
  localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY)
}
