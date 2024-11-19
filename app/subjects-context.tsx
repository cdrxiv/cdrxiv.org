'use client'

import React, { createContext, useContext, useMemo } from 'react'
import type { Subjects } from '../types/subject'

const SubjectsContext = createContext<Subjects>([])

interface SubjectsProviderProps {
  subjects: Subjects
  children: React.ReactNode
}
export const SubjectsProvider: React.FC<SubjectsProviderProps> = ({
  subjects,
  children,
}) => {
  return (
    <SubjectsContext.Provider value={subjects}>
      {children}
    </SubjectsContext.Provider>
  )
}

const TOPIC_AREAS = {
  'Accounting and verification': true,
  'Experiments and field trials': true,
  Modeling: true,
  'Social science and political economy': true,
}
export const useSubjects = () => {
  const subjects = useContext(SubjectsContext)

  if (!subjects) {
    throw new Error('Tried to use subjects before initiated or provided')
  }

  const sortedSubjects = useMemo(() => {
    const topics = subjects.filter((s) => TOPIC_AREAS.hasOwnProperty(s.name))
    const pathways = subjects.filter(
      (s) => !TOPIC_AREAS.hasOwnProperty(s.name) && s.name !== 'Other',
    )
    const other = subjects.filter((s) => s.name === 'Other')

    return [...topics, ...pathways, ...other]
  }, [subjects])

  return sortedSubjects
}
