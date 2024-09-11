'use client'

import { signIn, signOut } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

import { Button, Column, Field, Form, Row } from '../../../components'

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

const SignOutListener = () => {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('signOut')) {
      signOut()
      const params = new URLSearchParams(searchParams.toString())
      params.delete('signOut')
      const filteredParams = params.toString()
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${filteredParams ? `?${filteredParams}` : ''}`,
      )
    }
  }, [searchParams])

  return null
}

const Login = () => {
  return (
    <Form>
      <Suspense>
        <SignOutListener />
      </Suspense>

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
    </Form>
  )
}

export default Login
