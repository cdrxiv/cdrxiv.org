'use client'

import { Box, ThemeUIStyleObject } from 'theme-ui'
import useLoadingText from '../hooks/use-loading-text'

const Loading = ({
  baseText = 'Loading',
  sx = {},
}: {
  baseText?: string
  sx?: ThemeUIStyleObject
}) => {
  const loadingText = useLoadingText({ isLoading: true, baseText })
  return <Box sx={{ fontSize: 3, width: 100, ...sx }}>{loadingText}</Box>
}

export default Loading
