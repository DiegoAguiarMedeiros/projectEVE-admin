import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ADMIN_PATHS } from 'src/routes/paths'

export default function PageNotFound() {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
      }}
    >
      <Typography variant="h1" fontWeight={700} color="text.secondary">
        404
      </Typography>
      <Typography variant="h6" color="text.secondary">
        Page not found
      </Typography>
      <Button variant="contained" onClick={() => navigate(ADMIN_PATHS.dashboard)}>
        Go to Dashboard
      </Button>
    </Box>
  )
}
