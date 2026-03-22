import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AdminUser {
  id: string
  name: string
  email: string
  isAdminUser: boolean
}

interface AdminAuthState {
  user: AdminUser | null
  setUser: (user: AdminUser) => void
  clear: () => void
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clear: () => set({ user: null }),
    }),
    { name: 'admin-auth' }
  )
)
