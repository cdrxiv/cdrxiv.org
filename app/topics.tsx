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

  const midPoint = Math.ceil(subjects.length / 2)

  const totalCount = useMemo(() => {
    const allPreprints = subjects.reduce((preprints, subject) => {
      subject.preprints.forEach((p) => preprints.add(p))
      return preprints
    }, new Set())
    return allPreprints.size
  }, [subjects])

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
      role='option'
      aria-selected={currentSubject === name}
      aria-label={`${name} (${count} preprints)`}
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
    <Column start={[1, 1, 5, 5]} width={[3, 4, 8, 8]} sx={{ mb: [0, 0, 8, 8] }}>
      <Row columns={8}>
        <Column start={1} width={4}>
          <Box
            as='h2'
            ref={topicsBoxRef}
            sx={{ variant: 'text.monoCaps', mb: [1, 1, 3, 3] }}
          >
            Topics
          </Box>
        </Column>
      </Row>
      <Row
        columns={8}
        sx={{ display: ['none', 'none', 'grid', 'grid'] }}
        role='listbox'
        aria-label='Topics'
      >
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
            aria-expanded={subjectsMenuOpen}
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

      {subjectsMenuOpen && (
        <Menu
          setMenuOpen={setSubjectsMenuOpen}
          aria-label='Topics menu'
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
    </Column>
  )
}

export default Topics
