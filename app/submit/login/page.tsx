'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Box, Flex } from 'theme-ui'

import StyledLink from '../../../components/link'
import Expander from '../../../components/expander'
import Field from '../../../components/field'
import StyledButton from '../../../components/button'
import Row from '../../../components/row'
import Column from '../../../components/column'

const SubmissionLogin = () => {
  const { data: session, status } = useSession()

  return (
    <Flex sx={{ flexDirection: 'column', gap: 7 }}>
      {status === 'authenticated' && session && (
        <Box sx={{ position: 'relative' }}>
          <Expander label={`Signed in as ${session?.user?.email ?? 'Unknown'}`}>
            <Box sx={{ top: '28px' }}>
              <StyledLink
                onClick={() => signOut({ callbackUrl: '/' })}
                sx={{ position: 'absolute', variant: 'text.monoCaps' }}
              >
                Sign out
              </StyledLink>
            </Box>
          </Expander>
        </Box>
      )}

      {status === 'unauthenticated' && (
        <Field
          label=''
          id='signin'
          description='CDRXIV uses Janeway for authentication. Use your Janeway account credentials to log in and get started with your submission.'
        >
          <Row columns={6}>
            <Column start={1} width={[3, 4, 3, 3]}>
              <StyledButton onClick={() => signIn('janeway')}>
                Log in with Janeway
              </StyledButton>
            </Column>
          </Row>
        </Field>
      )}
    </Flex>
  )
}

export default SubmissionLogin
