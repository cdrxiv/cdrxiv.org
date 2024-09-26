export const isFullSiteEnabled = () => {
  return process.env.NEXT_PUBLIC_ENABLE_FULL_SITE === 'true'
}
