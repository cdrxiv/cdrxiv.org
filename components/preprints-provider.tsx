'use client'

import { createContext, useContext, ReactNode } from 'react'
import type { Preprints } from '../types/preprint'

const PreprintsContext = createContext<Preprints | null>(null)

export function usePreprints(): Preprints | null {
  return useContext(PreprintsContext)
}

export default function PreprintsProvider({
  data,
  children,
}: {
  data: Preprints
  children: ReactNode
}) {
  return (
    <PreprintsContext.Provider value={data}>
      {children}
    </PreprintsContext.Provider>
  )
}
