import React, { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Box, Flex } from 'theme-ui'
import { Button, Column, Link, Menu, Row, Select } from '../components'
import { useSubjects } from './subjects-context'
import type { Subjects } from '../types/subject'

const Topics = () => {
  const searchParams = useSearchParams()
  const subjects: Subjects = useSubjects()
  const topicsBoxRef = useRef<HTMLElement | null>(null)
  const [subjectsMenuOpen, setSubjectsMenuOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0 })

  const currentSubject = searchParams.get('subject') || 'All'

  const midPoint = Math.ceil(subjects.length / 2)

  const totalCount = useMemo(() => {
    const allPreprints = subjects.reduce((preprints, subject) => {
      subject.preprints.forEach((p) => preprints.add(p))
      return preprints
    }, new Set())
    return allPreprints.size
  }, [subjects])

  const createTopicUrl = (topic: string) => {
    const params = new URLSearchParams(Object.fromEntries(searchParams))
    if (topic === 'All') {
      params.delete('subject')
    } else {
      params.set('subject', topic)
    }
    return `/?${params.toString()}`
  }

  const renderSubject = (name: string, count: number) => (
    <Link
      href={createTopicUrl(name)}
      key={name}
      role='option'
      aria-selected={currentSubject === name}
      aria-label={`${name} (${count} preprints)`}
      sx={{
        textDecoration: 'none',
        color: 'text',
        ':visited': {
          color: 'text',
        },
        display: 'block',
        variant: 'styles.h2',
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
    </Link>
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
              '@media (scripting: none)': { display: 'none' },
            }}
          >
            {currentSubject}
          </Link>

          <noscript>
            <form method='get' action='/'>
              <Flex sx={{ gap: 1 }}>
                <Select
                  name='subject'
                  defaultValue={currentSubject === 'All' ? '' : currentSubject}
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    boxShadow: (
                      theme,
                    ) => `1px 1px 0px 1px ${theme?.colors?.text} inset,
        -1px -1px 0px 1px ${theme?.colors?.muted} inset`,
                    background: 'primary',
                  }}
                >
                  <option value=''>All</option>
                  {subjects.map((subject) => (
                    <option key={subject.name} value={subject.name}>
                      {subject.name} ({subject.preprints.length})
                    </option>
                  ))}
                </Select>

                <Button type='submit' sx={{ flexShrink: 0 }}>
                  Apply
                </Button>

                {/* Preserve other query parameters */}
                {Object.entries(searchParams).map(([key, value]) => {
                  if (key !== 'subject' && value !== undefined) {
                    return (
                      <input
                        key={key}
                        type='hidden'
                        name={key}
                        value={
                          Array.isArray(value) ? value[0] : (value as string)
                        }
                      />
                    )
                  }
                  return null
                })}
              </Flex>
            </form>
          </noscript>
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
