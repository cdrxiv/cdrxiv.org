'use client'

import { Box, Global, ThemeUIStyleObject } from 'theme-ui'
import useLoadingText from '../hooks/use-loading-text'

const Loading = ({
  baseText = 'Loading',
  sx = {},
}: {
  baseText?: string
  sx?: ThemeUIStyleObject
}) => {
  const loadingText = useLoadingText({ isLoading: true, baseText })
  return (
    <>
      <Global
        styles={{
          'html, body, *': {
            cursor: 'wait !important',
          },
        }}
      />
      <Box className='loading-area' sx={{ width: 100, ...sx }}>
        {loadingText}
      </Box>
    </>
  )
}

export default Loading
