import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'
import { adminBaseEnvelopesService } from 'src/api/services/adminBaseEnvelopes.service'
import type { UpdateBaseEnvelopePayload } from 'src/types/baseEnvelope.types'

export function useUpdateBaseEnvelope() {
  const qc = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBaseEnvelopePayload }) =>
      adminBaseEnvelopesService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'base-envelopes'] })
      enqueueSnackbar(t('baseEnvelopes.updateSuccess'), { variant: 'success' })
    },
  })
}
