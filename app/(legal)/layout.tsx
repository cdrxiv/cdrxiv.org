'use client'

import PaneledPage from '../../components/layouts/paneled-page'
import { usePathname } from 'next/navigation'

const PATHS = [
  { href: '/privacy-policy', title: 'CDRXIV Privacy Policy' },
  { href: '/terms-of-use', title: 'CDRXIV Terms of Use' },
  { href: '/cookies-notice', title: 'Cookies Notice' },
]

const Legal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname()
  const currentPath = PATHS.find((p) => p.href === pathname)

  return <PaneledPage title={currentPath?.title}>{children}</PaneledPage>
}

export default Legal
