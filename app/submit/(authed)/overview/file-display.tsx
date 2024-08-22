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
    <Link href={href} sx={{ variant: 'text.monoCaps', textTransform: 'none' }}>
      {name}
    </Link>
  ) : (
    <Box
      sx={{
        variant: 'text.monoCaps',
        color: 'listBorderGrey',
      }}
    >
      Not provided
    </Box>
  )
}

export default FileDisplay
