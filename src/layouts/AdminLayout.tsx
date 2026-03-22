import { useEffect, useState } from 'react'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Divider,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import FolderIcon from '@mui/icons-material/Folder'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import adminApiClient from 'src/api/client'
import { useAdminAuthStore } from 'src/store/useAdminAuthStore'
import { ADMIN_PATHS } from 'src/routes/paths'

const DRAWER_WIDTH = 240

export default function AdminLayout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, setUser, clear } = useAdminAuthStore()
  const [loading, setLoading] = useState(!user)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  useEffect(() => {
    if (!user) {
      adminApiClient
        .get('/users/me')
        .then((res) => {
          if (!res.data.isAdminUser) {
            navigate(ADMIN_PATHS.signIn)
          } else {
            setUser(res.data)
            setLoading(false)
          }
        })
        .catch(() => {
          navigate(ADMIN_PATHS.signIn)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogout = async () => {
    await adminApiClient.post('/auth/logout').catch(() => {})
    clear()
    navigate(ADMIN_PATHS.signIn)
  }

  const navItems = [
    { label: t('nav.dashboard'), icon: <DashboardIcon />, path: ADMIN_PATHS.dashboard },
    { label: t('nav.users'), icon: <PeopleIcon />, path: ADMIN_PATHS.users },
    { label: t('nav.baseEnvelopes'), icon: <FolderIcon />, path: ADMIN_PATHS.baseEnvelopes },
  ]

  if (loading) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 700 }}>
            projectEVE Admin
          </Typography>
          <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem disabled>
              <Typography variant="body2">{user?.name}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>{t('common.logout')}</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 1 }}>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  selected={
                    item.path === ADMIN_PATHS.dashboard
                      ? location.pathname === '/'
                      : location.pathname.startsWith(item.path)
                  }
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}
