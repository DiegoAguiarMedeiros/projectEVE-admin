import adminApiClient from 'src/api/client'
import type {
  AdminUsersFilters,
  AdminUsersResponse,
  AdminUserDTO,
  UpdateAdminUserPayload,
  UserEnvelopeDTO,
  UserSummaryDTO,
} from 'src/types/user.types'

export const adminUsersService = {
  getAll: (filters: AdminUsersFilters) =>
    adminApiClient
      .get<AdminUsersResponse>('/admin/users', { params: filters })
      .then((r) => r.data),

  getById: (id: string) =>
    adminApiClient.get<AdminUserDTO>(`/admin/users/${id}`).then((r) => r.data),

  update: (id: string, data: UpdateAdminUserPayload) =>
    adminApiClient.patch(`/admin/users/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    adminApiClient.delete(`/admin/users/${id}`).then((r) => r.data),

  getEnvelopes: (userId: string) =>
    adminApiClient
      .get<UserEnvelopeDTO[]>(`/admin/users/${userId}/envelopes`)
      .then((r) => r.data),

  getSummary: (userId: string) =>
    adminApiClient
      .get<UserSummaryDTO>(`/admin/users/${userId}/summary`)
      .then((r) => r.data),
}
