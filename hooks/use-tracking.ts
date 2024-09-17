import { usePlausible } from 'next-plausible'
import { useCallback } from 'react'

type Property =
  | 'preprint'
  | 'user'
  | 'error'
  | 'search_type'
  | 'search_value'
  | 'submission_type'
type Options = Partial<Record<Property, any>>

const useTracking = () => {
  const plausible = usePlausible()

  const track = useCallback(
    (name: string, options: Options) => {
      plausible(name, { props: options })
    },
    [plausible],
  )

  return track
}

export default useTracking
