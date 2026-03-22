import { Box, Typography, Button } from '@mui/material'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  action?: {
    label: string
    onClick: () => void
    icon?: ReactNode
  }
}

export default function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 3,
      }}
    >
      <Typography variant="h5" fontWeight={700}>
        {title}
      </Typography>
      {action && (
        <Button
          variant="contained"
          onClick={action.onClick}
          startIcon={action.icon}
        >
          {action.label}
        </Button>
      )}
    </Box>
  )
}
