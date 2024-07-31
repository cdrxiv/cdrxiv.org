'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Box, Checkbox, Flex, Label } from 'theme-ui'

import Field from '../../../components/field'
import StyledLink from '../../../components/link'
import Expander from '../../../components/expander'

const UserInfo = () => {
  const { data: session, status } = useSession()

  if (status === 'authenticated' && session) {
    return (
      <Box sx={{ position: 'relative' }}>
        <Expander label={`Signed in as ${session?.user?.email ?? 'Unknown'}`}>
          <Box sx={{ top: '28px' }}>
            <StyledLink onClick={() => signOut({ callbackUrl: '/' })}>
              Sign out
            </StyledLink>
          </Box>
        </Expander>
      </Box>
    )
  }

  return <StyledLink onClick={() => signIn('janeway')}>Sign in</StyledLink>
}

const SubmissionOverview = () => {
  return (
    <Flex sx={{ flexDirection: 'column', gap: 7 }}>
      <UserInfo />

      <Field label='Submission agreement' id='agreement'>
        <Label>
          <Checkbox id='agreement' />
          Authors grant us the right to publish, on this website, their uploaded
          manuscript, supplementary materials and any supplied metadata.
        </Label>
      </Field>

      <Field
        label='Submission contents'
        id='contents'
        description='Select the content types you’d like to include in your submission.'
      >
        <Flex sx={{ gap: 8 }}>
          <Label sx={{ width: 'fit-content', alignItems: 'center' }}>
            <Checkbox value='article' />
            Article
          </Label>
          <Label sx={{ width: 'fit-content', alignItems: 'center' }}>
            <Checkbox value='data' />
            Data
          </Label>
        </Flex>
      </Field>
    </Flex>
  )
}

export default SubmissionOverview
