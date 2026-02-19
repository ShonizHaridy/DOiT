export type AdminLevel = 'SUPER_ADMIN' | 'ADMIN'

export interface AdminUser {
  id: string
  adminId: string
  email: string
  adminLevel: AdminLevel
  createdAt: string
  updatedAt: string
}

export interface CreateAdminUserRequest {
  adminId: string
  email: string
  password: string
  adminLevel?: AdminLevel
}

export interface UpdateAdminUserRequest {
  adminId?: string
  email?: string
  password?: string
  adminLevel?: AdminLevel
}
