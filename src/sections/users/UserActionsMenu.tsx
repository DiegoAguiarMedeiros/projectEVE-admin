import { useState } from 'react'
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import BlockIcon from '@mui/icons-material/Block'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import PersonOffIcon from '@mui/icons-material/PersonOff'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { useTranslation } from 'react-i18next'
import ConfirmDialog from 'src/components/ConfirmDialog'
import { useUpdateAdminUser } from 'src/hooks/mutations/useUpdateAdminUser'
import { useDeleteAdminUser } from 'src/hooks/mutations/useDeleteAdminUser'
import type { AdminUserDTO } from 'src/types/user.types'

interface UserActionsMenuProps {
  user: AdminUserDTO
}

type DialogType = 'deactivate' | 'reactivate' | 'makeAdmin' | 'removeAdmin' | 'delete' | null

export default function UserActionsMenu({ user }: UserActionsMenuProps) {
  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [dialog, setDialog] = useState<DialogType>(null)

  const { mutate: updateUser, isPending: updating } = useUpdateAdminUser()
  const { mutate: deleteUser, isPending: deleting } = useDeleteAdminUser()

  const open = Boolean(anchorEl)

  const handleAction = (action: DialogType) => {
    setAnchorEl(null)
    setDialog(action)
  }

  const handleConfirm = () => {
    if (dialog === 'deactivate') updateUser({ id: user.id, data: { isDeleted: true } })
    if (dialog === 'reactivate') updateUser({ id: user.id, data: { isDeleted: false } })
    if (dialog === 'makeAdmin') updateUser({ id: user.id, data: { isAdminUser: true } })
    if (dialog === 'removeAdmin') updateUser({ id: user.id, data: { isAdminUser: false } })
    if (dialog === 'delete') deleteUser(user.id)
    setDialog(null)
  }

  const dialogConfig: Record<NonNullable<DialogType>, { title: string; description: string; color: 'error' | 'warning' | 'primary' }> = {
    deactivate: { title: t('users.deactivate'), description: t('users.deactivateConfirm'), color: 'warning' },
    reactivate: { title: t('users.reactivate'), description: t('users.reactivateConfirm'), color: 'primary' },
    makeAdmin: { title: t('users.makeAdmin'), description: `${t('users.makeAdmin')} ${user.name}?`, color: 'primary' },
    removeAdmin: { title: t('users.removeAdmin'), description: `${t('users.removeAdmin')} ${user.name}?`, color: 'warning' },
    delete: { title: t('users.delete'), description: t('users.deleteConfirm'), color: 'error' },
  }

  return (
    <>
      <Button
        variant="outlined"
        endIcon={<MoreVertIcon />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        {t('users.actions')}
      </Button>

      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        {user.isDeleted ? (
          <MenuItem onClick={() => handleAction('reactivate')}>
            <ListItemIcon><CheckCircleIcon fontSize="small" color="success" /></ListItemIcon>
            <ListItemText>{t('users.reactivate')}</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem onClick={() => handleAction('deactivate')}>
            <ListItemIcon><BlockIcon fontSize="small" color="warning" /></ListItemIcon>
            <ListItemText>{t('users.deactivate')}</ListItemText>
          </MenuItem>
        )}

        {user.isAdminUser ? (
          <MenuItem onClick={() => handleAction('removeAdmin')}>
            <ListItemIcon><PersonOffIcon fontSize="small" /></ListItemIcon>
            <ListItemText>{t('users.removeAdmin')}</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem onClick={() => handleAction('makeAdmin')}>
            <ListItemIcon><AdminPanelSettingsIcon fontSize="small" color="primary" /></ListItemIcon>
            <ListItemText>{t('users.makeAdmin')}</ListItemText>
          </MenuItem>
        )}

        <Divider />

        <MenuItem onClick={() => handleAction('delete')}>
          <ListItemIcon><DeleteForeverIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>{t('users.delete')}</ListItemText>
        </MenuItem>
      </Menu>

      {dialog && (
        <ConfirmDialog
          open
          title={dialogConfig[dialog].title}
          description={dialogConfig[dialog].description}
          onConfirm={handleConfirm}
          onClose={() => setDialog(null)}
          loading={updating || deleting}
          confirmColor={dialogConfig[dialog].color}
        />
      )}
    </>
  )
}
