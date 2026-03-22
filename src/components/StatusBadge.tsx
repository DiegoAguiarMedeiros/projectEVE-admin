import { Chip } from '@mui/material'
import { useTranslation } from 'react-i18next'

interface StatusBadgeProps {
  active: boolean
}

export default function StatusBadge({ active }: StatusBadgeProps) {
  const { t } = useTranslation()

  return (
    <Chip
      label={active ? t('common.active') : t('common.inactive')}
      color={active ? 'success' : 'default'}
      size="small"
    />
  )
}
