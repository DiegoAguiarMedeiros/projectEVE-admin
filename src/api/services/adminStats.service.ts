import adminApiClient from 'src/api/client'
import type { AdminStatsDTO, MonthlyStatDTO } from 'src/types/stats.types'

export const adminStatsService = {
  get: () =>
    adminApiClient.get<AdminStatsDTO>('/admin/stats').then((r) => r.data),

  getByMonth: (type: 'users' | 'transactions', months?: number) =>
    adminApiClient
      .get<MonthlyStatDTO[]>(`/admin/stats/${type}`, { params: { months } })
      .then((r) => r.data),
}
