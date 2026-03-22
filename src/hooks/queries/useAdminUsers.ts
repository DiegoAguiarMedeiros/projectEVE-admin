import { useQuery } from '@tanstack/react-query'
import { adminUsersService } from 'src/api/services/adminUsers.service'
import type { AdminUsersFilters } from 'src/types/user.types'

export function useAdminUsers(filters: AdminUsersFilters) {
  return useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: () => adminUsersService.getAll(filters),
  })
}
