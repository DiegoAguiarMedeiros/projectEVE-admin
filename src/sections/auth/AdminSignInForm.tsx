import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import adminApiClient from 'src/api/client'
import { useAdminAuthStore } from 'src/store/useAdminAuthStore'
import { ADMIN_PATHS } from 'src/routes/paths'

export default function AdminSignInForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setUser } = useAdminAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await adminApiClient.post('/auth/login', { email, password })
      const meRes = await adminApiClient.get('/users/me')

      if (!meRes.data.isAdminUser) {
        await adminApiClient.post('/auth/logout').catch(() => {})
        setError(t('auth.notAdmin'))
        setLoading(false)
        return
      }

      setUser(meRes.data)
      navigate(ADMIN_PATHS.dashboard)
    } catch {
      setError(t('auth.loginError'))
      setLoading(false)
    }
  }

  return (
    <Card sx={{ width: 400, mx: 2 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom align="center">
          projectEVE Admin
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          {t('auth.signIn')}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label={t('auth.email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={t('auth.password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || !email || !password}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : t('auth.signIn')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
