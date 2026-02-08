import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthResponse } from '@/types/auth'

interface AuthState {
  accessToken: string | null
  user: AuthResponse['user'] | null
  setAuth: (data: AuthResponse) => void
  setAccessToken: (token: string | null) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setAuth: (data) => set({ accessToken: data.accessToken, user: data.user }),
      setAccessToken: (token) => set({ accessToken: token }),
      clearAuth: () => set({ accessToken: null, user: null }),
    }),
    {
      name: 'doit-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    }
  )
)
