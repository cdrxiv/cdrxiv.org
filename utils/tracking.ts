import { track as vercelTrack } from '@vercel/analytics'

type Options = Record<string, any>

export const track = (name: string, options: Options) => {
  vercelTrack(name, options)
  if (window.plausible) {
    window.plausible(name, { props: options })
  }
}
