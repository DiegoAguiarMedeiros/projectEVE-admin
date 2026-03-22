import { useQuery } from '@tanstack/react-query'
import { adminStatsService } from 'src/api/services/adminStats.service'

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminStatsService.get(),
    staleTime: 1000 * 60 * 5,
  })
}

export function useAdminStatsByMonth(type: 'users' | 'transactions', months?: number) {
  return useQuery({
    queryKey: ['admin', 'stats', type, months],
    queryFn: () => adminStatsService.getByMonth(type, months),
    staleTime: 1000 * 60 * 5,
  })
}
