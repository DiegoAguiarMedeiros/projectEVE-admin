import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import type { AdminUserDTO, AdminUsersFilters } from 'src/types/user.types'
import { ADMIN_PATHS } from 'src/routes/paths'

interface UsersTableProps {
  users: AdminUserDTO[]
  total: number
  filters: AdminUsersFilters
  loading: boolean
  onFiltersChange: (f: AdminUsersFilters) => void
}

export default function UsersTable({
  users,
  total,
  filters,
  loading,
  onFiltersChange,
}: UsersTableProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const page = (filters.page ?? 1) - 1
  const limit = filters.limit ?? 20

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!loading && users.length === 0) {
    return (
      <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
        {t('common.error')}
      </Typography>
    )
  }

  return (
    <Paper>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('users.name')}</TableCell>
              <TableCell>{t('users.email')}</TableCell>
              <TableCell align="center">{t('users.isAdmin')}</TableCell>
              <TableCell align="center">{t('users.isDeleted')}</TableCell>
              <TableCell align="center">{t('users.emailVerified')}</TableCell>
              <TableCell>{t('users.createdAt')}</TableCell>
              <TableCell align="center">{t('users.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell align="center">
                  {user.isAdminUser ? (
                    <Chip label="Admin" color="primary" size="small" />
                  ) : (
                    <Chip label={t('users.regular')} size="small" />
                  )}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={user.isDeleted ? t('users.deleted') : t('users.active')}
                    color={user.isDeleted ? 'default' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  {user.isEmailVerified ? (
                    <CheckCircleIcon color="success" fontSize="small" />
                  ) : (
                    <CancelIcon color="disabled" fontSize="small" />
                  )}
                </TableCell>
                <TableCell>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : '-'}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title={t('users.view')}>
                    <IconButton
                      size="small"
                      onClick={() => navigate(ADMIN_PATHS.userDetail(user.id))}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page}
        rowsPerPage={limit}
        onPageChange={(_e, newPage) =>
          onFiltersChange({ ...filters, page: newPage + 1 })
        }
        onRowsPerPageChange={(e) =>
          onFiltersChange({ ...filters, limit: parseInt(e.target.value, 10), page: 1 })
        }
        rowsPerPageOptions={[10, 20, 50]}
      />
    </Paper>
  )
}
