'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Box, Flex } from 'theme-ui'

import { Button, Column, Field, Form, Link, Row } from '../../../components'

const SignIn = () => {
  const searchParams = useSearchParams()

  return (
    <Button
      sx={{ flexShrink: 0 }}
      onClick={() =>
        signIn(
          'janeway',
          searchParams.get('callbackUrl')
            ? {
                callbackUrl: searchParams.get('callbackUrl') as string,
              }
            : undefined,
        )
      }
    >
      Log in with Janeway
    </Button>
  )
}

const Login = () => {
  const searchParams = useSearchParams()
  return (
    <Form>
      {searchParams.get('activated') === 'true' && (
        <Box>
          Your account has been activated! Log in below to complete account set
          up.
        </Box>
      )}
      <Field
        id='signin'
        description={
          <Box sx={{ mt: [2, 2, 2, 3] }}>
            CDRXIV uses Janeway for authentication. Use your Janeway account
            credentials to log in and get started with your submission.
          </Box>
        }
      >
        <Row columns={6}>
          <Column start={1} width={[6, 6, 6, 6]}>
            <Flex sx={{ gap: [3, 3, 3, 4], alignItems: 'baseline' }}>
              <Suspense>
                <SignIn />
              </Suspense>
              <Box sx={{ variant: 'text.mono' }}>
                Or,{' '}
                <Link href='/register' sx={{ variant: 'text.mono' }}>
                  create a new account
                </Link>
                .
              </Box>
            </Flex>
          </Column>
        </Row>
      </Field>
    </Form>
  )
}

export default Login
