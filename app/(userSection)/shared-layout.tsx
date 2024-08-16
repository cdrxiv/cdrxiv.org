'use client'

import { useRouter } from 'next/navigation'

import { Link } from '../../components'
import PaneledPage from '../../components/layouts/paneled-page'
import Sidebar from './sidebar'

const SharedLayout: React.FC<{
  back?: boolean
  title: string
  children: React.ReactNode
}> = ({ back, title, children }) => {
  const router = useRouter()

  return (
    <PaneledPage
      title={title}
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
      sidebar={<Sidebar />}
    >
      {children}
    </PaneledPage>
  )
}

export default SharedLayout
