'use client'

import { useCallback, useEffect, useState } from 'react'
import { Active, DndContext, Over } from '@dnd-kit/core'

import { usePreprint } from '../../preprint-context'
import { Row } from '../../../../components'
import AuthorCard from './author-card'
import { updatePreprint } from '../../../../actions'

type Props = {
  removable?: boolean
}
const AuthorsList: React.FC<Props> = ({ removable = true }) => {
  const { preprint, setPreprint } = usePreprint()
  const [authors, setAuthors] = useState(preprint.authors)

  const handleDrag = useCallback(
    ({ active, over }: { active: Active; over: Over | null }) => {
      if (over && active.id !== over.id) {
        const activeIndex = preprint.authors.findIndex(
          ({ pk }) => pk === active.id,
        )
        const overIndex = preprint.authors.findIndex(({ pk }) => pk === over.id)

        // Create a copy of the array
        const updatedAuthors = [...preprint.authors]

        // Remove the active item from its original position
        const [movedAuthor] = updatedAuthors.splice(activeIndex, 1)

        // Insert the active item at the new position
        updatedAuthors.splice(overIndex, 0, movedAuthor)

        setAuthors(updatedAuthors)
        updatePreprint(preprint, {
          authors: updatedAuthors,
        }).then((updatedPreprint) => setPreprint(updatedPreprint))
      }
    },
    [preprint, setPreprint],
  )

  useEffect(() => {
    setAuthors(preprint.authors)
  }, [preprint.authors])

  return (
    <Row columns={[1, 1, 2, 2]} gap={[5, 6, 6, 8]}>
      <DndContext onDragEnd={handleDrag}>
        {authors.map((a, i) => (
          <AuthorCard
            key={a.email}
            index={i}
            author={a}
            removable={removable}
            draggable={authors.length > 1}
          />
        ))}
      </DndContext>
    </Row>
  )
}

export default AuthorsList
