import { Grid } from '@mui/material'
import { useTranslation } from 'react-i18next'
import KpiCard from 'src/components/KpiCard'
import { useAdminStats } from 'src/hooks/queries/useAdminStats'

export default function DashboardKpis() {
  const { t } = useTranslation()
  const { data: stats, isLoading } = useAdminStats()

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard label={t('dashboard.totalUsers')} value={stats?.totalUsers} loading={isLoading} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard label={t('dashboard.activeUsers')} value={stats?.activeUsers} loading={isLoading} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard label={t('dashboard.newUsersMonth')} value={stats?.usersRegisteredThisMonth} loading={isLoading} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard label={t('dashboard.totalTransactions')} value={stats?.totalTransactions} loading={isLoading} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard label={t('dashboard.totalEnvelopes')} value={stats?.totalEnvelopes} loading={isLoading} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard label={t('dashboard.totalProcessedIncomes')} value={stats?.totalProcessedIncomes} loading={isLoading} />
      </Grid>
    </Grid>
  )
}
