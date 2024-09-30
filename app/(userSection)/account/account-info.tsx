'use client'

import { signOut, useSession } from 'next-auth/react'
import { Box } from 'theme-ui'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

import { Button, Field } from '../../../components'
import SharedLayout from '../shared-layout'
import AccountForm from './account-form'
import Login from './login'

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

const AccountInfo = () => {
  const { data: session, status, update } = useSession()
  return (
    <SharedLayout title='Account'>
      {status === 'authenticated' && session?.user ? (
        <>
          <Suspense>
            <SignOutListener />
          </Suspense>

          <Field
            label=''
            description='CDRXIV uses Janeway for authentication. Signing out does not deactivate your Janeway session.'
          >
            <Button
              onClick={() => signOut({ callbackUrl: '/' })}
              sx={{ width: 'fit-content' }}
            >
              Sign out
            </Button>
          </Field>

          <Box as='hr' sx={{ mt: 7, mb: 4 }} />
        </>
      ) : (
        <Login />
      )}
      {status === 'authenticated' && session?.user && (
        <AccountForm user={session.user} updateUser={update} />
      )}
    </SharedLayout>
  )
}

export default AccountInfo
