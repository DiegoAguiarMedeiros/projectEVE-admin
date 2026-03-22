export interface AdminUserDTO {
  id: string
  name: string
  email: string
  isEmailVerified: boolean
  isAdminUser: boolean
  isDeleted: boolean
  isRegistrationComplete: boolean
  createdAt: string
  updatedAt: string
}

export interface AdminUsersFilters {
  page?: number
  limit?: number
  search?: string
  isDeleted?: boolean
  isAdmin?: boolean
}

export interface AdminUsersResponse {
  users: AdminUserDTO[]
  total: number
  page: number
  limit: number
}

export interface UpdateAdminUserPayload {
  isDeleted?: boolean
  isAdminUser?: boolean
  isEmailVerified?: boolean
}

export interface UserEnvelopeDTO {
  id: string
  name: string
  color: string
  order: number
  percentage: number
}

export interface UserSummaryDTO {
  totalEnvelopes: number
  totalIncomes: number
  totalTransactions: number
  totalProcessedIncomes: number
}
