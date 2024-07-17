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
        display: 'inline-block',
        width: 'fit-content',
        height: ['24px', '24px', '24px', '28px'],
        px: [1, 1, 1, 2],
        backgroundColor: color,
        textAlign: 'center',
        fontSize: [2, 2, 2, 3],
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

export default Badge
