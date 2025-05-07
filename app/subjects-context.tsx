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

const FOCUSES = new Set([
  'Removal process',
  'Storage process',
  'Supporting infrastructure',
  'Environmental impacts',
  'Socioeconomic impacts',
  'Policy and regulation',
])
const TYPES = new Set(['Biological CDR', 'Geochemical CDR', 'Synthetic CDR'])
const METHODS = new Set([
  'Accounting',
  'Experiments and field trials',
  'Modeling',
  'Qualitative research',
])

export const useSubjects = () => {
  const subjects = useContext(SubjectsContext)

  if (!subjects) {
    throw new Error('Tried to use subjects before initiated or provided')
  }

  const buckets = useMemo(() => {
    return {
      focus: subjects.filter((s) => FOCUSES.has(s.name)),
      type: subjects.filter((s) => TYPES.has(s.name)),
      method: subjects.filter((s) => METHODS.has(s.name)),
    }
  }, [subjects])

  return { subjects, buckets }
}
