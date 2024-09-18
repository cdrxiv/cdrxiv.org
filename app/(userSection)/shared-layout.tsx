'use client'

import { useRouter } from 'next/navigation'

import { Link, NavSidebar } from '../../components'
import PaneledPage from '../../components/layouts/paneled-page'

const PATHS = [
  { href: '/account', title: 'Account', public: true },
  { href: '/submissions', title: 'Submissions' },
]

const SharedLayout: React.FC<{
  back?: boolean
  title: string
  children: React.ReactNode
  metadata?: React.ReactNode
}> = ({ back, title, children, metadata }) => {
  const router = useRouter()

  return (
    <PaneledPage
      title={title}
      metadata={metadata}
      leftCorner={
        back && (
          <Link
            sx={{ variant: 'text.monoCaps' }}
            backArrow
            onClick={router.back}
          >
            Back
          </Link>
        )
      }
      sidebar={<NavSidebar paths={PATHS} />}
    >
      {children}
    </PaneledPage>
  )
}

export default SharedLayout
