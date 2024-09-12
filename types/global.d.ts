interface Window {
  plausible?: (name: string, options?: PlausibleOptions) => void
}

interface PlausibleOptions {
  props?: Record<string, any>
  callback?: () => void
}
