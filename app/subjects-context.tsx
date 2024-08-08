'use client'

import React, { createContext, useContext } from 'react'
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

export const useSubjects = () => {
  const subjects = useContext(SubjectsContext)

  if (!subjects) {
    throw new Error('Tried to use subjects before initiated or provided')
  }
  return subjects
}
