'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

import { Button, Column, Field, Form, Link, Row } from '../../../components'

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

const Login = () => {
  return (
    <Form>
      <Field
        id='signin'
        description={
          <>
            CDRXIV uses Janeway for authentication. Use your Janeway account
            credentials to log in and get started with your submission. Or,{' '}
            <Link href='/register' sx={{ variant: 'text.mono' }}>
              create a new account
            </Link>
            .
          </>
        }
      >
        <Row columns={6}>
          <Column start={1} width={[3, 4, 3, 3]}>
            <Suspense>
              <SignIn />
            </Suspense>
          </Column>
        </Row>
      </Field>
    </Form>
  )
}

export default Login
