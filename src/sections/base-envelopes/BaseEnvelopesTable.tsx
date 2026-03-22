import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Box,
  CircularProgress,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useTranslation } from 'react-i18next'
import ConfirmDialog from 'src/components/ConfirmDialog'
import { useDeleteBaseEnvelope } from 'src/hooks/mutations/useDeleteBaseEnvelope'
import type { AdminBaseEnvelopeDTO } from 'src/types/baseEnvelope.types'

interface BaseEnvelopesTableProps {
  envelopes: AdminBaseEnvelopeDTO[]
  loading: boolean
  onEdit: (envelope: AdminBaseEnvelopeDTO) => void
}

export default function BaseEnvelopesTable({
  envelopes,
  loading,
  onEdit,
}: BaseEnvelopesTableProps) {
  const { t } = useTranslation()
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const { mutate: deleteEnvelope, isPending } = useDeleteBaseEnvelope()

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('baseEnvelopes.order')}</TableCell>
                <TableCell>{t('baseEnvelopes.name')}</TableCell>
                <TableCell>{t('baseEnvelopes.color')}</TableCell>
                <TableCell align="center">{t('baseEnvelopes.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {envelopes.map((env) => (
                <TableRow key={env.id} hover>
                  <TableCell>{env.order}</TableCell>
                  <TableCell>{env.name}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          bgcolor: env.color,
                          border: '1px solid rgba(0,0,0,0.15)',
                        }}
                      />
                      {env.color}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title={t('baseEnvelopes.edit')}>
                      <IconButton size="small" onClick={() => onEdit(env)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('baseEnvelopes.delete')}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteTarget(env.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={t('baseEnvelopes.delete')}
        description={t('baseEnvelopes.deleteConfirm')}
        onConfirm={() => {
          if (deleteTarget) deleteEnvelope(deleteTarget)
          setDeleteTarget(null)
        }}
        onClose={() => setDeleteTarget(null)}
        loading={isPending}
      />
    </>
  )
}
