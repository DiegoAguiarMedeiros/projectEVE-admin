import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  onConfirm: () => void
  onClose: () => void
  loading?: boolean
  confirmColor?: 'primary' | 'error' | 'warning'
}

export default function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onClose,
  loading = false,
  confirmColor = 'error',
}: ConfirmDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          variant="contained"
          disabled={loading}
        >
          {t('common.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
