import { useTranslation } from 'react-i18next'
import PageHeader from 'src/components/PageHeader'
import DashboardKpis from 'src/sections/dashboard/DashboardKpis'
import DashboardCharts from 'src/sections/dashboard/DashboardCharts'

export default function DashboardPage() {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader title={t('dashboard.title')} />
      <DashboardKpis />
      <DashboardCharts />
    </>
  )
}
