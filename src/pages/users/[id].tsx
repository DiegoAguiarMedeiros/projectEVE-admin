import {
  Box,
  Tab,
  Tabs,
  Typography,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Grid,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import UserDetailCard from 'src/sections/users/UserDetailCard'
import UserActionsMenu from 'src/sections/users/UserActionsMenu'
import { useAdminUserById, useAdminUserEnvelopes, useAdminUserSummary } from 'src/hooks/queries/useAdminUserById'
import { ADMIN_PATHS } from 'src/routes/paths'

export default function UserDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)

  const { data: user, isLoading } = useAdminUserById(id ?? '')
  const { data: envelopes } = useAdminUserEnvelopes(id ?? '')
  const { data: summary } = useAdminUserSummary(id ?? '')

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!user) {
    return <Typography>{t('common.error')}</Typography>
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(ADMIN_PATHS.users)}
            variant="text"
          >
            {t('users.title')}
          </Button>
          <Typography variant="h6" fontWeight={700}>
            / {user.name}
          </Typography>
        </Box>
        <UserActionsMenu user={user} />
      </Box>

      <Tabs value={tab} onChange={(_e, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label={t('users.tabs.profile')} />
        <Tab label={t('users.tabs.envelopes')} />
        <Tab label={t('users.tabs.summary')} />
      </Tabs>

      {tab === 0 && <UserDetailCard user={user} />}

      {tab === 1 && (
        <Paper>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('baseEnvelopes.order')}</TableCell>
                  <TableCell>{t('baseEnvelopes.name')}</TableCell>
                  <TableCell>{t('baseEnvelopes.color')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(envelopes ?? []).map((env) => (
                  <TableRow key={env.id} hover>
                    <TableCell>{env.order}</TableCell>
                    <TableCell>{env.name}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            bgcolor: env.color,
                            border: '1px solid rgba(0,0,0,0.15)',
                          }}
                        />
                        {env.color}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {(envelopes ?? []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography color="text.secondary" variant="body2" sx={{ py: 2 }}>
                        {t('common.loading')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {tab === 2 && summary && (
        <Grid container spacing={2}>
          {[
            { label: t('users.summary.envelopes'), value: summary.totalEnvelopes },
            { label: t('users.summary.incomes'), value: summary.totalIncomes },
            { label: t('users.summary.transactions'), value: summary.totalTransactions },
            { label: t('users.summary.processedIncomes'), value: summary.totalProcessedIncomes },
          ].map((item) => (
            <Grid key={item.label} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                  <Typography variant="h5" fontWeight={700}>{item.value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  )
}
