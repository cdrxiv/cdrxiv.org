import { track as vercelTrack } from '@vercel/analytics'

type Property = 'preprint' | 'user' | 'error' | 'search_type' | 'search_value'
type Options = Partial<Record<Property, any>>

export const track = (name: string, options: Options) => {
  vercelTrack(name, options)
  if (window.plausible) {
    window.plausible(name, { props: options })
  }
}
