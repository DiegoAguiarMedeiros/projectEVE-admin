import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'
import { adminBaseEnvelopesService } from 'src/api/services/adminBaseEnvelopes.service'
import type { CreateBaseEnvelopePayload } from 'src/types/baseEnvelope.types'

export function useCreateBaseEnvelope() {
  const qc = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (data: CreateBaseEnvelopePayload) =>
      adminBaseEnvelopesService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'base-envelopes'] })
      enqueueSnackbar(t('baseEnvelopes.createSuccess'), { variant: 'success' })
    },
  })
}
