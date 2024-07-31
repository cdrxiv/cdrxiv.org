import React, { useCallback, useState } from 'react'
import { Box, ThemeUIStyleObject } from 'theme-ui'

import StyledLink from './link'

interface Props {
  label: string
  children: React.ReactNode
  sx?: ThemeUIStyleObject
}

const Expander: React.FC<Props> = ({ label, children, sx }) => {
  const [expanded, setExpanded] = useState(false)

  const handleClick = useCallback(() => {
    setExpanded((prev) => !prev)
  }, [])

  return (
    <>
      <StyledLink
        onClick={handleClick}
        sx={{ variant: 'text.monoCaps', position: 'relative', ...sx }}
      >
        {label}&nbsp;
        <Box as='span' sx={{ color: 'background' }}>
          {'>'}
        </Box>
        <Box
          as='span'
          sx={{
            position: 'absolute',
            right: 0,
            top: '-2px',
            display: 'inline-block',
            transform: expanded
              ? 'rotate(90deg) translateX(3px)'
              : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          {'>'}
        </Box>
      </StyledLink>
      {expanded && children}
    </>
  )
}

export default Expander
