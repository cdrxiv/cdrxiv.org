'use client'

import { Box } from 'theme-ui'
import { Form, Link } from '../../../../../components'

const ErrorState = ({
  text = 'Error activating account. If your account may have already been activated, try logging in instead.',
}: {
  text?: string
}) => {
  return (
    <Form>
      <Box>{text}</Box>

      <Link href='/account' forwardArrow>
        Log in
      </Link>
    </Form>
  )
}

export default ErrorState
