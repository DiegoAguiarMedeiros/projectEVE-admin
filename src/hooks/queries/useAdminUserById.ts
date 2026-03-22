import { useQuery } from '@tanstack/react-query'
import { adminUsersService } from 'src/api/services/adminUsers.service'

export function useAdminUserById(id: string) {
  return useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: () => adminUsersService.getById(id),
    enabled: !!id,
  })
}

export function useAdminUserEnvelopes(userId: string) {
  return useQuery({
    queryKey: ['admin', 'users', userId, 'envelopes'],
    queryFn: () => adminUsersService.getEnvelopes(userId),
    enabled: !!userId,
  })
}

export function useAdminUserSummary(userId: string) {
  return useQuery({
    queryKey: ['admin', 'users', userId, 'summary'],
    queryFn: () => adminUsersService.getSummary(userId),
    enabled: !!userId,
  })
}
