'use client'

import PaneledPage from '../../components/layouts/paneled-page'
import { NavSidebar } from '../../components'
import { usePathname } from 'next/navigation'
import { TagProvider } from './faq/tag-selector'

const PATHS = [
  { href: '/about', title: 'About', public: true },
  { href: '/about/faq', title: 'FAQ', public: true },
  {
    href: '/about/scope',
    title: 'Scope',
    public: true,
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
        title={currentPath?.title}
      >
        {children}
      </PaneledPage>
    </TagProvider>
  )
}

export default About
