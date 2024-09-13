import { track as vercelTrack } from '@vercel/analytics'
import { usePlausible } from 'next-plausible'
import { useCallback } from 'react'

type Property = 'preprint' | 'user' | 'error' | 'search_type' | 'search_value'
type Options = Partial<Record<Property, any>>

const useTracking = ({ skipVercel }: { skipVercel?: boolean } = {}) => {
  const plausible = usePlausible()

  const track = useCallback(
    (name: string, options: Options) => {
      !skipVercel && vercelTrack(name, options)
      plausible(name, { props: options })
    },
    [skipVercel, plausible],
  )

  return track
}

export default useTracking
