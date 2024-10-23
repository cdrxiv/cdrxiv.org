import React, { useMemo, useRef, useState } from 'react'
import { Box, Flex } from 'theme-ui'
import { useRouter, useSearchParams } from 'next/navigation'
import { Column, Link, Menu, Row } from '../components'
import { useSubjects } from './subjects-context'
import type { Subjects } from '../types/subject'

const Topics: React.FC = () => {
  const subjects: Subjects = useSubjects()
  const router = useRouter()
  const searchParams = useSearchParams()
  const topicsBoxRef = useRef<HTMLElement | null>(null)

  const subjectParam = searchParams.get('subject') || 'All'

  const [currentSubject, setCurrentSubject] = useState(subjectParam)
  const [subjectsMenuOpen, setSubjectsMenuOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0 })

  const midPoint = Math.ceil(subjects.length / 2) - 1 // -1 accounts for All option

  const totalCount = useMemo(
    () => subjects.reduce((sum, subject) => sum + subject.preprints.length, 0),
    [subjects],
  )

  const handleFilterChange = (newFilter: string) => {
    const params = new URLSearchParams(searchParams)
    if (newFilter === 'All' || newFilter === currentSubject) {
      params.delete('subject')
      setCurrentSubject('All')
    } else {
      params.set('subject', newFilter)
      setCurrentSubject(newFilter)
    }
    router.push(`/?${params.toString()}`)
  }

  const renderSubject = (name: string, count: number) => (
    <Box
      as='button'
      onClick={() => handleFilterChange(name)}
      key={name}
      sx={{
        display: 'block',
        variant: 'styles.h2',
        cursor: 'pointer',
        width: 'fit-content',
        padding: 0,
        border: 'none',
        textAlign: 'left',
        bg: currentSubject === name ? 'highlight' : 'transparent',
        mb: '2px',
        ':hover': {
          bg: 'highlight',
        },
      }}
    >
      {name}

      <Box
        as='sup'
        sx={{ display: ['none', 'none', 'initial', 'initial'], ml: 2 }}
      >
        {count}
      </Box>
    </Box>
  )

  return (
    <>
      <Column
        start={[1, 1, 5, 5]}
        width={[6, 6, 8, 8]}
        sx={{ mb: [0, 0, 8, 8] }}
      >
        <Row columns={8}>
          <Column start={1} width={4}>
            <Box ref={topicsBoxRef} sx={{ variant: 'text.monoCaps', mb: 3 }}>
              Topics
            </Box>
          </Column>
        </Row>
        <Row columns={8} sx={{ display: ['none', 'none', 'grid', 'grid'] }}>
          <Column start={1} width={4}>
            <Flex sx={{ flexDirection: 'column', gap: [2, 2, 2, 3] }}>
              {renderSubject('All', totalCount)}
              {subjects
                .slice(0, midPoint)
                .map((subject) =>
                  renderSubject(subject.name, subject.preprints.length),
                )}
            </Flex>
          </Column>
          <Column start={5} width={4}>
            <Flex sx={{ flexDirection: 'column', gap: [2, 2, 2, 3] }}>
              {subjects
                .slice(midPoint)
                .map((subject) =>
                  renderSubject(subject.name, subject.preprints.length),
                )}
            </Flex>
          </Column>
        </Row>

        {/* Mobile */}
        <Row columns={8} sx={{ display: ['flex', 'flex', 'none', 'none'] }}>
          <Column start={1} width={4}>
            <Link
              onClick={() => {
                if (topicsBoxRef.current) {
                  const rect = topicsBoxRef.current.getBoundingClientRect()
                  setMenuPosition({ top: rect.top })
                }
                setSubjectsMenuOpen(true)
              }}
              sx={{
                variant: 'text.body',
                fontSize: [2, 2, 2, 3],
                textTransform: 'capitalize',
              }}
            >
              {currentSubject}
            </Link>
          </Column>
        </Row>
      </Column>
      {subjectsMenuOpen && (
        <Menu
          setMenuOpen={setSubjectsMenuOpen}
          sx={{
            top: `${menuPosition.top}px`,
            height: '50vh',
            overflowY: 'auto',
          }}
        >
          {renderSubject('All', totalCount)}
          {subjects.map((subject) =>
            renderSubject(subject.name, subject.preprints.length),
          )}
        </Menu>
      )}
    </>
  )
}

export default Topics
