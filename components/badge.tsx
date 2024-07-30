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
        width: 'fit-content',
        px: ['6px', '6px', '6px', '10px'],
        py: ['7px', '7px', '7px', '6px'],
        backgroundColor: color,
        lineHeight: 1,
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

export default Badge
