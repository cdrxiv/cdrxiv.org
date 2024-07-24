import React from 'react'
import { Box, ThemeUIStyleObject } from 'theme-ui'

interface BadgeProps {
  children: React.ReactNode
  color: string
  sx?: ThemeUIStyleObject
}

const Badge: React.FC<BadgeProps> = ({ children, color, sx = {} }) => {
  return (
    <Box
      sx={{
        variant: 'text.monoCaps',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'fit-content',
        height: ['24px', '24px', '24px', '28px'],
        px: [1, 1, 1, 2],
        backgroundColor: color,
        textAlign: 'center',
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

export default Badge
