import React, { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Box, Flex } from 'theme-ui'
import { Button, Column, Link, Menu, Row, Select } from '../components'
import { useSubjects } from './subjects-context'

const useTopicUrl = (topic: string) => {
  const searchParams = useSearchParams()
  const params = new URLSearchParams(Object.fromEntries(searchParams))
  if (topic.startsWith('All')) {
    params.delete('subject')
  } else {
    params.set('subject', topic)
  }
  return `/?${params.toString()}`
}

const Topic = ({ name, count }: { name: string; count: number }) => {
  const topicUrl = useTopicUrl(name)
  const searchParams = useSearchParams()
  const selected = searchParams.get('subject')
    ? searchParams.get('subject') === name
    : name.startsWith('All')

  return (
    <Link
      href={topicUrl}
      key={name}
      role='option'
      aria-selected={selected}
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
        bg: selected ? 'highlight' : 'transparent',
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
}

const Topics = () => {
  const searchParams = useSearchParams()
  const { subjects, buckets } = useSubjects()
  const topicsBoxRef = useRef<HTMLElement | null>(null)
  const [subjectsMenuOpen, setSubjectsMenuOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0 })

  const currentSubject = searchParams.get('subject') || 'All'

  const counts = useMemo(() => {
    const allPreprints = subjects.reduce((preprints, subject) => {
      subject.preprints.forEach((p) => preprints.add(p))
      return preprints
    }, new Set())
    const currentPreprints = new Set(
      subjects.find((s) => s.name === currentSubject)?.preprints ??
        allPreprints,
    )

    const bySubject = subjects.reduce<Record<string, number>>(
      (accum, subject) => {
        const subjectPreprints = new Set(subject.preprints)
        accum[subject.name] =
          currentPreprints.intersection(subjectPreprints).size

        return accum
      },
      {},
    )

    return { total: allPreprints.size, subjects: bySubject }
  }, [subjects, currentSubject])

  return (
    <Column start={[1, 1, 5, 5]} width={[3, 4, 8, 8]} sx={{ mb: [0, 0, 8, 8] }}>
      <Row columns={8}>
        <Column
          start={1}
          width={4}
          sx={{ display: ['inherit', 'inherit', 'none', 'none'] }}
        >
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
        <Column start={1} width={8} sx={{ pt: 1 }}>
          <Topic name='All topics' count={counts.total} />
        </Column>

        <Column start={1} width={4} sx={{ mt: 4 }}>
          <Flex
            sx={{
              flexDirection: 'column',
              gap: [2, 2, 2, 3],
            }}
          >
            <Box as='h3' sx={{ variant: 'text.monoCaps' }}>
              Type
            </Box>

            {buckets.type.map((subject) => (
              <Topic
                key={subject.name}
                name={subject.name}
                count={counts.subjects[subject.name]}
              />
            ))}

            <Box as='h3' sx={{ variant: 'text.monoCaps', mt: 3 }}>
              Method
            </Box>

            {buckets.method.map((subject) => (
              <Topic
                key={subject.name}
                name={subject.name}
                count={counts.subjects[subject.name]}
              />
            ))}
          </Flex>
        </Column>

        <Column start={5} width={4} sx={{ mt: 4 }}>
          <Flex sx={{ flexDirection: 'column', gap: [2, 2, 2, 3] }}>
            <Box as='h3' sx={{ variant: 'text.monoCaps' }}>
              Focus
            </Box>
            {buckets.focus.map((subject) => (
              <Topic
                key={subject.name}
                name={subject.name}
                count={counts.subjects[subject.name]}
              />
            ))}
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

                  <optgroup label='Type'>
                    {buckets.type.map((subject) => (
                      <option key={subject.name} value={subject.name}>
                        {subject.name} ({counts.subjects[subject.name]})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label='Focus'>
                    {buckets.focus.map((subject) => (
                      <option key={subject.name} value={subject.name}>
                        {subject.name} ({counts.subjects[subject.name]})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label='Method'>
                    {buckets.focus.map((subject) => (
                      <option key={subject.name} value={subject.name}>
                        {subject.name} ({counts.subjects[subject.name]})
                      </option>
                    ))}
                  </optgroup>
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
          <Topic name='All' count={counts.total} />

          <Box as='h3' sx={{ variant: 'text.mono' }}>
            Type
          </Box>

          {buckets.type.map((subject) => (
            <Topic
              key={subject.name}
              name={subject.name}
              count={counts.subjects[subject.name]}
            />
          ))}

          <Box as='h3' sx={{ variant: 'text.mono' }}>
            Focus
          </Box>

          {buckets.focus.map((subject) => (
            <Topic
              key={subject.name}
              name={subject.name}
              count={counts.subjects[subject.name]}
            />
          ))}

          <Box as='h3' sx={{ variant: 'text.mono' }}>
            Method
          </Box>

          {buckets.method.map((subject) => (
            <Topic
              key={subject.name}
              name={subject.name}
              count={counts.subjects[subject.name]}
            />
          ))}
        </Menu>
      )}
    </Column>
  )
}

export default Topics
