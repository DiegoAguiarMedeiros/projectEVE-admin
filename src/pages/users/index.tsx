import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from 'src/components/PageHeader'
import UserFilters from 'src/sections/users/UserFilters'
import UsersTable from 'src/sections/users/UsersTable'
import { useAdminUsers } from 'src/hooks/queries/useAdminUsers'
import type { AdminUsersFilters } from 'src/types/user.types'

export default function UsersPage() {
  const { t } = useTranslation()
  const [filters, setFilters] = useState<AdminUsersFilters>({ page: 1, limit: 20 })
  const { data, isLoading } = useAdminUsers(filters)

  return (
    <>
      <PageHeader title={t('users.title')} />
      <UserFilters filters={filters} onChange={setFilters} />
      <UsersTable
        users={data?.users ?? []}
        total={data?.total ?? 0}
        filters={filters}
        loading={isLoading}
        onFiltersChange={setFilters}
      />
    </>
  )
}
