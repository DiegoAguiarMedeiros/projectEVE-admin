import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useCreateBaseEnvelope } from 'src/hooks/mutations/useCreateBaseEnvelope'
import { useUpdateBaseEnvelope } from 'src/hooks/mutations/useUpdateBaseEnvelope'
import type { AdminBaseEnvelopeDTO } from 'src/types/baseEnvelope.types'

interface BaseEnvelopeFormProps {
  open: boolean
  onClose: () => void
  editing?: AdminBaseEnvelopeDTO | null
}

export default function BaseEnvelopeForm({ open, onClose, editing }: BaseEnvelopeFormProps) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [color, setColor] = useState('#1976d2')
  const [order, setOrder] = useState(1)
  const [percentage, setPercentage] = useState(0)

  const { mutate: create, isPending: creating } = useCreateBaseEnvelope()
  const { mutate: update, isPending: updating } = useUpdateBaseEnvelope()

  useEffect(() => {
    if (editing) {
      setName(editing.name)
      setColor(editing.color)
      setOrder(editing.order)
      setPercentage(editing.percentage)
    } else {
      setName('')
      setColor('#1976d2')
      setOrder(1)
      setPercentage(0)
    }
  }, [editing, open])

  const loading = creating || updating

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      update(
        { id: editing.id, data: { name, color, order, percentage } },
        { onSuccess: onClose }
      )
    } else {
      create({ name, color, order, percentage }, { onSuccess: onClose })
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {editing ? t('baseEnvelopes.edit') : t('baseEnvelopes.add')}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label={t('baseEnvelopes.name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
          />
          <Box>
            <Typography variant="caption" color="text.secondary">
              {t('baseEnvelopes.color')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: color,
                  border: '1px solid rgba(0,0,0,0.2)',
                  flexShrink: 0,
                }}
              />
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{ width: 48, height: 40, cursor: 'pointer', border: 'none' }}
              />
              <TextField
                size="small"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                inputProps={{ pattern: '^#[0-9A-Fa-f]{6}$' }}
                sx={{ flex: 1 }}
              />
            </Box>
          </Box>
          <TextField
            label={t('baseEnvelopes.order')}
            type="number"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value, 10))}
            inputProps={{ min: 1 }}
            required
            fullWidth
          />
          <TextField
            label={t('baseEnvelopes.percentage')}
            type="number"
            value={percentage}
            onChange={(e) => setPercentage(Number(e.target.value))}
            inputProps={{ min: 0, max: 100 }}
            required
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            {t('baseEnvelopes.cancel')}
          </Button>
          <Button type="submit" variant="contained" disabled={loading || !name}>
            {t('baseEnvelopes.save')}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
