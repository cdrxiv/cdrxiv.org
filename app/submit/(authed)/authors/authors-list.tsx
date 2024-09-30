'use client'

import { useCallback, useState } from 'react'
import { Active, DndContext, Over } from '@dnd-kit/core'

import { usePreprint } from '../../preprint-context'
import { Row } from '../../../../components'
import AuthorCard from './author-card'

type Props = {
  removable?: boolean
}
const AuthorsList: React.FC<Props> = ({ removable = true }) => {
  const { preprint } = usePreprint()
  const [authors, setAuthors] = useState(preprint.authors)

  const handleDrag = useCallback(
    ({ active, over }: { active: Active; over: Over | null }) => {
      if (over && active.id !== over.id) {
        setAuthors((prev) => {
          const activeIndex = prev.findIndex(
            (author) => author.pk === active.id,
          )
          const overIndex = prev.findIndex((author) => author.pk === over.id)

          // Create a copy of the array
          const updatedAuthors = [...prev]

          // Remove the active item from its original position
          const [movedAuthor] = updatedAuthors.splice(activeIndex, 1)

          // Insert the active item at the new position
          updatedAuthors.splice(overIndex, 0, movedAuthor)

          return updatedAuthors
        })
      }
    },
    [],
  )

  return (
    <Row columns={[1, 1, 2, 2]} gap={[5, 6, 6, 8]}>
      <DndContext onDragEnd={handleDrag}>
        {authors.map((a) => (
          <AuthorCard key={a.email} author={a} removable={removable} />
        ))}
      </DndContext>
    </Row>
  )
}

export default AuthorsList
