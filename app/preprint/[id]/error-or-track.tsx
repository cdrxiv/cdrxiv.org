import React, { useEffect } from 'react'
import { Box } from 'theme-ui'

import useTracking from '../../../hooks/use-tracking'

const ErrorOrTrack = ({
  hasError,
  preview,
  errorMessage,
  pk,
  mt = 0,
}: {
  hasError: boolean
  preview?: boolean
  errorMessage: string
  pk: number
  mt?: number
}) => {
  const track = useTracking()

  useEffect(() => {
    // track error when present and viewing outside of preview setting
    if (!preview && hasError) {
      track('preprint_metadata_error', { error: errorMessage, preprint: pk })
    }
  }, [track, preview, hasError, errorMessage, pk])

  if (preview && hasError) {
    // in preview setting, render error message for repository manager to triage when an error is present
    return <Box sx={{ variant: 'styles.error', mt }}>{errorMessage}</Box>
  }

  // otherwise do not render
  return null
}

export default ErrorOrTrack
