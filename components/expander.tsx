import React, { useCallback, useEffect, useState } from 'react'
import { Box, ThemeUIStyleObject } from 'theme-ui'

import StyledLink from './link'

interface Props {
  label: string
  children?: React.ReactNode
  sx?: ThemeUIStyleObject
  // Optional props for using as controlled input
  expanded?: boolean
  setExpanded?: (value: boolean) => void
}

const Expander: React.FC<Props> = ({
  label,
  children,
  sx,
  expanded: expandedProp,
  setExpanded: setExpandedProp,
}) => {
  const [expanded, setExpanded] = useState(expandedProp ?? false)

  const handleClick = useCallback(() => {
    setExpanded(!expanded)
    setExpandedProp && setExpandedProp(!expanded)
  }, [setExpandedProp, expanded])

  useEffect(() => {
    if (typeof expandedProp === 'boolean') {
      setExpanded(expandedProp)
    }
  }, [expandedProp])

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
