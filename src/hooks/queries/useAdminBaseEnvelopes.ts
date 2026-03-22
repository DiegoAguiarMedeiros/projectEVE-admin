import { useQuery } from '@tanstack/react-query'
import { adminBaseEnvelopesService } from 'src/api/services/adminBaseEnvelopes.service'

export function useAdminBaseEnvelopes() {
  return useQuery({
    queryKey: ['admin', 'base-envelopes'],
    queryFn: () => adminBaseEnvelopesService.getAll(),
  })
}
