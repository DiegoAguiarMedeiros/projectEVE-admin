export interface AdminBaseEnvelopeDTO {
  id: string
  name: string
  color: string
  order: number
  percentage: number
}

export interface CreateBaseEnvelopePayload {
  name: string
  color: string
  order: number
  percentage: number
}

export interface UpdateBaseEnvelopePayload {
  name?: string
  color?: string
  order?: number
  percentage?: number
}
