import { Card, CardContent, Typography, Skeleton } from '@mui/material'

interface KpiCardProps {
  label: string
  value?: number
  loading?: boolean
}

export default function KpiCard({ label, value, loading = false }: KpiCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {label}
        </Typography>
        {loading ? (
          <Skeleton width={80} height={48} />
        ) : (
          <Typography variant="h4" fontWeight={700}>
            {value?.toLocaleString() ?? '-'}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
