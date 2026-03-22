import adminApiClient from 'src/api/client'
import type {
  AdminBaseEnvelopeDTO,
  CreateBaseEnvelopePayload,
  UpdateBaseEnvelopePayload,
} from 'src/types/baseEnvelope.types'

export const adminBaseEnvelopesService = {
  getAll: () =>
    adminApiClient
      .get<AdminBaseEnvelopeDTO[]>('/admin/base-envelopes')
      .then((r) => r.data),

  create: (data: CreateBaseEnvelopePayload) =>
    adminApiClient.post('/admin/base-envelopes', data).then((r) => r.data),

  update: (id: string, data: UpdateBaseEnvelopePayload) =>
    adminApiClient
      .patch(`/admin/base-envelopes/${id}`, data)
      .then((r) => r.data),

  delete: (id: string) =>
    adminApiClient
      .delete(`/admin/base-envelopes/${id}`)
      .then((r) => r.data),
}
