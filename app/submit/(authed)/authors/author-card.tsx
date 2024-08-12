import { Box, Flex } from 'theme-ui'
import { useSession } from 'next-auth/react'
import { useCallback } from 'react'

import { usePreprint } from '../preprint-context'
import { Author } from '../../../../types/preprint'
import StyledLink from '../../../../components/link'
import { updatePreprint } from '../actions'

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

export default AuthorCard
