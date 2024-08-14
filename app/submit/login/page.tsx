'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Box, Flex } from 'theme-ui'
import { Suspense } from 'react'

import { Button, Column, Expander, Field, Link, Row } from '../../../components'

const SignIn = () => {
  const searchParams = useSearchParams()

  return (
    <Button
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

const SubmissionLogin = () => {
  const { data: session, status } = useSession()

  return (
    <Flex sx={{ flexDirection: 'column', gap: 7 }}>
      {status === 'authenticated' && session && (
        <Field label='Signed in' id='signin'>
          <Box sx={{ position: 'relative' }}>
            <Expander
              label={
                session?.user?.first_name
                  ? `${session?.user?.first_name} ${session?.user?.last_name}`
                  : 'Unknown'
              }
            >
              <Box sx={{ top: '28px' }}>
                <Link
                  onClick={() => signOut({ callbackUrl: '/' })}
                  sx={{ position: 'absolute', variant: 'text.monoCaps' }}
                >
                  Sign out
                </Link>
              </Box>
            </Expander>
          </Box>
        </Field>
      )}

      {status === 'unauthenticated' && (
        <Field
          label=''
          id='signin'
          description='CDRXIV uses Janeway for authentication. Use your Janeway account credentials to log in and get started with your submission.'
        >
          <Row columns={6}>
            <Column start={1} width={[3, 4, 3, 3]}>
              <Suspense>
                <SignIn />
              </Suspense>
            </Column>
          </Row>
        </Field>
      )}
    </Flex>
  )
}

export default SubmissionLogin
