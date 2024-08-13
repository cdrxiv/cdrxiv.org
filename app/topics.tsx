import React, { useRef, useState } from 'react'
import { Box } from 'theme-ui'
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
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })

  const midPoint = Math.ceil(subjects.length / 2) - 1 // -1 accounts for All option

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

  const renderSubject = (name: string) => (
    <Box
      onClick={() => handleFilterChange(name)}
      key={name}
      sx={{
        variant: 'text.body',
        cursor: 'pointer',
        width: 'fit-content',
        bg: currentSubject === name ? 'highlight' : 'transparent',
        mb: '2px',
        ':hover': {
          bg: 'highlight',
        },
      }}
    >
      {name}
    </Box>
  )

  return (
    <>
      <Column start={[1, 1, 5, 5]} width={[6, 6, 8, 8]}>
        <Row columns={8}>
          <Column start={1} width={4}>
            <Box ref={topicsBoxRef} sx={{ variant: 'text.monoCaps', mb: 3 }}>
              Topics
            </Box>
          </Column>
        </Row>
        <Row columns={8} sx={{ display: ['none', 'none', 'flex', 'flex'] }}>
          <Column start={1} width={4}>
            {renderSubject('All')}
            {subjects
              .slice(0, midPoint)
              .map((subject) => renderSubject(subject.name))}
          </Column>
          <Column start={5} width={4}>
            {subjects
              .slice(midPoint)
              .map((subject) => renderSubject(subject.name))}
          </Column>
        </Row>

        {/* Mobile */}
        <Row columns={8} sx={{ display: ['flex', 'flex', 'none', 'none'] }}>
          <Column start={1} width={4}>
            <Link
              onClick={() => {
                if (topicsBoxRef.current) {
                  const rect = topicsBoxRef.current.getBoundingClientRect()
                  console.log(rect)
                  setMenuPosition({ top: rect.top, left: rect.left })
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
            top: `${menuPosition.top - 90}px`,
            left: `${menuPosition.left - 30}px`,
            height: '50vh',
            overflowY: 'auto',
          }}
        >
          {renderSubject('All')}
          {subjects.map((subject) => renderSubject(subject.name))}
        </Menu>
      )}
    </>
  )
}

export default Topics
