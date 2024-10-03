'use client'

import { Form, Link } from '../../../../components'

const Page = () => {
  return (
    <Form>
      Your account has been created! Please check your email for an activation
      link.
      <Link href='/' forwardArrow>
        Home
      </Link>
    </Form>
  )
}

export default Page
