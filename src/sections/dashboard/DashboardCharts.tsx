import { Card, CardContent, Typography, Grid, Box } from '@mui/material'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import { useAdminStatsByMonth } from 'src/hooks/queries/useAdminStats'
import type { MonthlyStatDTO } from 'src/types/stats.types'

function formatMonthLabel(item: MonthlyStatDTO) {
  return `${String(item.month).padStart(2, '0')}/${item.year}`
}

export default function DashboardCharts() {
  const { t } = useTranslation()
  const { data: usersData } = useAdminStatsByMonth('users', 12)
  const { data: transactionsData } = useAdminStatsByMonth('transactions', 6)

  const usersChartData = (usersData ?? []).map((d) => ({
    label: formatMonthLabel(d),
    count: d.count,
  }))

  const transactionsChartData = (transactionsData ?? []).map((d) => ({
    label: formatMonthLabel(d),
    count: d.count,
  }))

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Card>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              {t('dashboard.usersOverTime')}
            </Typography>
            <Box sx={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usersChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#1976d2"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              {t('dashboard.transactionsOverTime')}
            </Typography>
            <Box sx={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transactionsChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#9c27b0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
