import { Box, Flex } from 'theme-ui'
import { useSession } from 'next-auth/react'
import { useCallback } from 'react'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

import { usePreprint } from '../../preprint-context'
import { Author } from '../../../../types/preprint'
import { Link } from '../../../../components'
import { updatePreprint } from '../../../../actions/preprint'

const AuthorCard = ({
  author,
  removable,
  draggable,
}: {
  author: Author
  removable: boolean
  draggable: boolean
}) => {
  const { data: session } = useSession()
  const { preprint, setPreprint } = usePreprint()
  const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
    id: author.pk,
  })
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: author.pk,
    disabled: !draggable,
  })

  const handleClick = useCallback(() => {
    updatePreprint(preprint, {
      authors: preprint.authors.filter(({ pk }) => pk !== author.pk),
    }).then((updatedPreprint) => setPreprint(updatedPreprint))
  }, [preprint, author, setPreprint])

  return (
    <Box ref={setDroppableNodeRef}>
      <Box
        ref={setDraggableNodeRef}
        sx={{
          cursor: draggable ? 'pointer' : 'default',
          variant: 'text.mono',
          width: '100%',
          height: 'auto',
          p: [3, 6, 6, 7],
          borderColor: 'text',
          borderWidth: '1px',
          borderStyle: 'solid',
          outline: 'none', // use highlight style for focus instead
          transform: CSS.Translate.toString(transform),
          background: isOver && !isDragging ? 'background' : 'white',
        }}
        {...listeners}
        {...attributes}
      >
        <Flex sx={{ flexDirection: 'column', gap: 1 }}>
          <Flex sx={{ justifyContent: 'space-between' }}>
            <Box>
              {author.first_name} {author.last_name}
              {author.pk === session?.user?.id ? ' (owner)' : ''}
            </Box>
            {removable && (
              <Link
                sx={{ variant: 'text.monoCaps', textDecoration: 'none' }}
                onClick={handleClick}
              >
                (X)
              </Link>
            )}
          </Flex>
          <Box>{author.email}</Box>
          {author.institution && <Box>{author.institution}</Box>}
        </Flex>
      </Box>
    </Box>
  )
}

export default AuthorCard
