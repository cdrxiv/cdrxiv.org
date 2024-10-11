'use client'

import PaneledPage from '../../components/layouts/paneled-page'
import { NavSidebar } from '../../components'
import { usePathname } from 'next/navigation'
import { TagSelector, TagProvider } from './faq/tag-selector'

const PATHS = [
  { href: '/about', title: 'About', public: true },
  { href: '/about/faq', title: 'FAQ', public: true },
  { href: '/about/resources', title: 'Resources', public: true },
  {
    href: '/about/resources/scope',
    title: 'Scope',
    public: true,
    sx: { ml: '20px' },
  },
  {
    href: '/about/resources/privacy',
    title: 'Privacy policy',
    public: true,
    sx: { ml: '20px' },
  },
  { href: '/about/team', title: 'Team', public: true },
]

const About: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname()
  const currentPath = PATHS.find((p) => p.href === pathname)

  return (
    <TagProvider>
      <PaneledPage
        sidebar={<NavSidebar paths={PATHS} />}
        metadata={pathname.startsWith('/about/faq') && <TagSelector />}
        title={currentPath?.title}
      >
        {children}
      </PaneledPage>
    </TagProvider>
  )
}

export default About
