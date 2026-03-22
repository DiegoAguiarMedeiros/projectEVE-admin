import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'
import { adminBaseEnvelopesService } from 'src/api/services/adminBaseEnvelopes.service'

export function useDeleteBaseEnvelope() {
  const qc = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (id: string) => adminBaseEnvelopesService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'base-envelopes'] })
      enqueueSnackbar(t('baseEnvelopes.deleteSuccess'), { variant: 'success' })
    },
  })
}
