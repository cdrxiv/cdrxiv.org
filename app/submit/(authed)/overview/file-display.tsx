'use client'

import React from 'react'

import { Link } from '../../../../components'
import { Box } from 'theme-ui'

type Props = {
  name?: string | null
  href?: string
}
const FileDisplay: React.FC<Props> = ({ name, href }) => {
  return name ? (
    <Link
      href={href}
      sx={{
        variant: 'styles.a',
        fontFamily: 'mono',
        fontWeight: 'mono',
        fontSize: [0, 0, 0, 1],
        textTransform: 'none',
      }}
    >
      {name}
    </Link>
  ) : (
    <Box
      sx={{
        variant: 'styles.a',
        textDecoration: 'none',
        fontFamily: 'mono',
        fontWeight: 'mono',
        fontSize: [0, 0, 0, 1],
        color: 'listBorderGrey',
      }}
    >
      Not provided
    </Box>
  )
}

export default FileDisplay
