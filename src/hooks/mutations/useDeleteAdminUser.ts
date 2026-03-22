import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { adminUsersService } from 'src/api/services/adminUsers.service'
import { ADMIN_PATHS } from 'src/routes/paths'

export function useDeleteAdminUser() {
  const qc = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (id: string) => adminUsersService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      enqueueSnackbar(t('users.deleteSuccess'), { variant: 'success' })
      navigate(ADMIN_PATHS.users)
    },
  })
}
