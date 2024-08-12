'use client'

import { Box, Flex } from 'theme-ui'
import { useSession } from 'next-auth/react'
import { useCallback } from 'react'

import NavButtons from '../../nav-buttons'
import Field from '../../../../components/field'
import StyledButton from '../../../../components/button'
import AuthorForm from './author-form'
import { usePreprint } from '../preprint-context'
import { Author } from '../../../../types/preprint'
import Row from '../../../../components/row'
import StyledLink from '../../../../components/link'
import { updatePreprint } from '../actions'
import AuthorSearch from './author-search'

const AuthorCard = ({ author }: { author: Author }) => {
  const { data: session } = useSession()
  const { preprint, setPreprint } = usePreprint()

  const handleClick = useCallback(() => {
    updatePreprint(preprint, {
      authors: preprint.authors.filter(({ pk }) => pk !== author.pk),
    }).then((updatedPreprint) => setPreprint(updatedPreprint))
  }, [preprint, author])

  return (
    <Box
      sx={{
        variant: 'text.mono',
        width: '100%',
        height: 'auto',
        p: [3, 6, 6, 7],
        borderColor: 'text',
        borderWidth: '1px',
        borderStyle: 'solid',
        outline: 'none', // use highlight style for focus instead
      }}
    >
      <Flex sx={{ flexDirection: 'column', gap: 1 }}>
        <Flex sx={{ justifyContent: 'space-between' }}>
          <Box>
            {author.first_name} {author.last_name}
            {author.pk === session?.user?.id ? ' (owner)' : ''}
          </Box>
          <StyledLink
            sx={{ variant: 'text.monoCaps', textDecoration: 'none' }}
            onClick={handleClick}
          >
            (X)
          </StyledLink>
        </Flex>
        <Box>{author.email}</Box>
        {author.institution && <Box>{author.institution}</Box>}
      </Flex>
    </Box>
  )
}

const AddSelf = () => {
  const { data: session } = useSession()
  const { preprint, setPreprint } = usePreprint()

  const handleClick = useCallback(() => {
    if (session?.user && session?.user.email) {
      updatePreprint(preprint, {
        authors: [
          ...preprint.authors,
          { pk: session?.user.id, email: session?.user.email },
        ],
      }).then((updatedPreprint) => setPreprint(updatedPreprint))
    }
  }, [preprint, session?.user])

  const isAdded = !!preprint.authors.find(({ pk }) => pk === session?.user?.id)
  return (
    <StyledButton
      sx={{ width: 'fit-content' }}
      onClick={handleClick}
      disabled={isAdded}
    >
      {isAdded ? 'Added' : 'Add self as author'}
    </StyledButton>
  )
}

const Authors = () => {
  const { preprint } = usePreprint()
  return (
    <div>
      <Flex sx={{ flexDirection: 'column', gap: 8 }}>
        <Field
          label='Overview'
          id='overview'
          description={
            <ol>
              <li>
                You can add yourself as an author using the button below. This
                will copy metadata from your profile to create a submission
                author record.
              </li>
              <li>
                You can search the database of existing authors to add them as
                authors.
              </li>
              <li>
                You can create new records for authors using the form below.
              </li>
            </ol>
          }
        >
          <Row columns={[1, 1, 2, 2]} gap={[5, 6, 6, 8]}>
            {preprint.authors.map((a) => (
              <AuthorCard key={a.email} author={a} />
            ))}
          </Row>
        </Field>

        <Field
          label='Add self'
          id='self'
          description={
            <>
              Your account will be the owner of this submission, but is not an
              author on record by default. Click the button above to add
              yourself as an author.
              <br />
              <br />
              To have the submission linked to a different account, have the
              owner of that account complete this process from their account.
            </>
          }
        >
          <AddSelf />
        </Field>

        <Field
          label='Search for an author'
          id='search'
          description='You can search by email or ORCID'
        >
          <AuthorSearch />
        </Field>

        <Field label='Add new author' id='new'>
          <AuthorForm />
        </Field>
      </Flex>

      <NavButtons />
    </div>
  )
}

export default Authors
