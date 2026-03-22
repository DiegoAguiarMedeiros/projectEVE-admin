import {
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Divider,
  Box,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { useTranslation } from 'react-i18next'
import type { AdminUserDTO } from 'src/types/user.types'

interface UserDetailCardProps {
  user: AdminUserDTO
}

interface InfoRowProps {
  label: string
  value: React.ReactNode
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Box>{value}</Box>
    </Box>
  )
}

export default function UserDetailCard({ user }: UserDetailCardProps) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {user.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {user.email}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={0}>
          <Grid size={12}>
            <InfoRow
              label={t('users.isAdmin')}
              value={
                user.isAdminUser ? (
                  <Chip label="Admin" color="primary" size="small" />
                ) : (
                  <Chip label={t('users.regular')} size="small" />
                )
              }
            />
            <InfoRow
              label={t('users.isDeleted')}
              value={
                <Chip
                  label={user.isDeleted ? t('users.deleted') : t('users.active')}
                  color={user.isDeleted ? 'default' : 'success'}
                  size="small"
                />
              }
            />
            <InfoRow
              label={t('users.emailVerified')}
              value={
                user.isEmailVerified ? (
                  <CheckCircleIcon color="success" fontSize="small" />
                ) : (
                  <CancelIcon color="disabled" fontSize="small" />
                )
              }
            />
            <InfoRow
              label={t('users.registrationComplete')}
              value={
                user.isRegistrationComplete ? (
                  <CheckCircleIcon color="success" fontSize="small" />
                ) : (
                  <CancelIcon color="disabled" fontSize="small" />
                )
              }
            />
            <InfoRow
              label={t('users.createdAt')}
              value={
                <Typography variant="body2">
                  {user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}
                </Typography>
              }
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
