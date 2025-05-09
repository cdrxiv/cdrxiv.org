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

const FOCUSES = [
  'Removal process',
  'Storage process',
  'Supporting infrastructure',
  'Environmental impacts',
  'Socioeconomic impacts',
  'Policy and regulation',
]
const TYPES = ['Biological CDR', 'Geochemical CDR', 'Synthetic CDR']
const METHODS = [
  'Accounting',
  'Experiments and field trials',
  'Modeling',
  'Qualitative research',
]

const getBucket = (allSubjects: Subjects, bucketSubjects: string[]) => {
  return bucketSubjects.reduce((result: Subjects, name) => {
    const subj = allSubjects.find((s) => s.name === name)
    if (subj) result.push(subj)
    return result
  }, [])
}

export const useSubjects = () => {
  const subjects = useContext(SubjectsContext)

  if (!subjects) {
    throw new Error('Tried to use subjects before initiated or provided')
  }

  const buckets = useMemo(() => {
    return {
      focus: getBucket(subjects, FOCUSES),
      type: getBucket(subjects, TYPES),
      method: getBucket(subjects, METHODS),
    }
  }, [subjects])

  return { subjects, buckets }
}
