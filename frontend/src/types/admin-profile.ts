export interface AdminProfile {
  id: string
  adminId: string
  role: string
  fullName: string
  email: string
  phoneNumber: string
  avatarUrl?: string
}

export interface UpdateAdminProfileRequest {
  fullName?: string
  email?: string
  phoneNumber?: string
  avatarUrl?: string
  role?: string
}
