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
          const [lowIndex, highIndex] = [over.id, active.id]
            .map((id) => prev.findIndex((author) => author.pk === id))
            .sort()

          return [
            ...prev.slice(0, lowIndex),
            prev[highIndex],
            prev[lowIndex],
            ...prev.slice(lowIndex + 1, highIndex),
            ...prev.slice(highIndex + 1),
          ]
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
