import { usePathname } from 'next/navigation'

type ColorsObject = {
  cardBackground: string[]
  overallBackground: string[]
}

const useBackgroundColors = (): ColorsObject => {
  const pathname = usePathname()
  // TODO: expand this to include preprint viewing paths
  if (pathname.startsWith('/submit/')) {
    return {
      cardBackground: ['primary', 'primary', 'background', 'background'],
      overallBackground: ['background', 'background', 'primary', 'primary'],
    }
  }
  return {
    cardBackground: ['background'],
    overallBackground: ['primary'],
  }
}

export default useBackgroundColors
