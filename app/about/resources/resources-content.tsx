'use client'

import { Link } from '../../../components'

const ResourcesContent: React.FC = () => {
  return (
    <>
      <Link href='/about/resources/scope' sx={{ display: 'block', mb: 2 }}>
        Scope
      </Link>
      <Link href='/about/resources/privacy' sx={{ display: 'block' }}>
        Privacy Policy
      </Link>
    </>
  )
}

export default ResourcesContent
