import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'
import { adminUsersService } from 'src/api/services/adminUsers.service'
import type { UpdateAdminUserPayload } from 'src/types/user.types'

export function useUpdateAdminUser() {
  const qc = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAdminUserPayload }) =>
      adminUsersService.update(id, data),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      qc.invalidateQueries({ queryKey: ['admin', 'users', id] })
      enqueueSnackbar(t('users.updateSuccess'), { variant: 'success' })
    },
  })
}
