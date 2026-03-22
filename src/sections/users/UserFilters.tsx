import { Box, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { AdminUsersFilters } from 'src/types/user.types'

interface UserFiltersProps {
  filters: AdminUsersFilters
  onChange: (filters: AdminUsersFilters) => void
}

export default function UserFilters({ filters, onChange }: UserFiltersProps) {
  const { t } = useTranslation()

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      <TextField
        label={t('users.search')}
        size="small"
        value={filters.search ?? ''}
        onChange={(e) => onChange({ ...filters, search: e.target.value || undefined, page: 1 })}
        sx={{ minWidth: 260 }}
      />

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>{t('users.status')}</InputLabel>
        <Select
          value={filters.isDeleted === undefined ? 'all' : String(filters.isDeleted)}
          label={t('users.status')}
          onChange={(e) => {
            const v = e.target.value
            onChange({
              ...filters,
              isDeleted: v === 'all' ? undefined : v === 'true',
              page: 1,
            })
          }}
        >
          <MenuItem value="all">{t('users.all')}</MenuItem>
          <MenuItem value="false">{t('users.active')}</MenuItem>
          <MenuItem value="true">{t('users.deleted')}</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>{t('users.adminFilter')}</InputLabel>
        <Select
          value={filters.isAdmin === undefined ? 'all' : String(filters.isAdmin)}
          label={t('users.adminFilter')}
          onChange={(e) => {
            const v = e.target.value
            onChange({
              ...filters,
              isAdmin: v === 'all' ? undefined : v === 'true',
              page: 1,
            })
          }}
        >
          <MenuItem value="all">{t('users.all')}</MenuItem>
          <MenuItem value="true">{t('users.admins')}</MenuItem>
          <MenuItem value="false">{t('users.regular')}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
