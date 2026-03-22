import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { useTranslation } from 'react-i18next'
import PageHeader from 'src/components/PageHeader'
import BaseEnvelopesTable from 'src/sections/base-envelopes/BaseEnvelopesTable'
import BaseEnvelopeForm from 'src/sections/base-envelopes/BaseEnvelopeForm'
import { useAdminBaseEnvelopes } from 'src/hooks/queries/useAdminBaseEnvelopes'
import type { AdminBaseEnvelopeDTO } from 'src/types/baseEnvelope.types'

export default function BaseEnvelopesPage() {
  const { t } = useTranslation()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<AdminBaseEnvelopeDTO | null>(null)
  const { data: envelopes = [], isLoading } = useAdminBaseEnvelopes()

  const handleEdit = (env: AdminBaseEnvelopeDTO) => {
    setEditing(env)
    setFormOpen(true)
  }

  const handleClose = () => {
    setFormOpen(false)
    setEditing(null)
  }

  return (
    <>
      <PageHeader
        title={t('baseEnvelopes.title')}
        action={{
          label: t('baseEnvelopes.add'),
          onClick: () => setFormOpen(true),
          icon: <AddIcon />,
        }}
      />
      <BaseEnvelopesTable
        envelopes={envelopes}
        loading={isLoading}
        onEdit={handleEdit}
      />
      <BaseEnvelopeForm open={formOpen} onClose={handleClose} editing={editing} />
    </>
  )
}
