'use client'

import React from 'react'
import { Box } from 'theme-ui'

import { Link } from '../../../../components'
import { decodeFilename } from '../../../../utils/formatters'

type Props = {
  name?: string | null
  href?: string
}
const FileDisplay: React.FC<Props> = ({ name, href }) => {
  return name ? (
    <Link
      href={href}
      sx={{
        variant: 'text.mono',
        textTransform: 'none',
      }}
    >
      {decodeFilename(name)}
    </Link>
  ) : (
    <Box
      sx={{
        variant: 'text.mono',
        color: 'listBorderGrey',
      }}
    >
      Not provided
    </Box>
  )
}

export default FileDisplay
