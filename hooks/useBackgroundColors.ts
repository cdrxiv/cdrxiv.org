import { usePathname } from 'next/navigation'

type ColorsObject = {
  cardBackground: string[]
  overallBackground: string[]
}

const useBackgroundColors = (): ColorsObject => {
  const pathname = usePathname()
  if (
    pathname.startsWith('/submit/') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/submissions') ||
    pathname.startsWith('/preprint/')
  ) {
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
