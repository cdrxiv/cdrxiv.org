'use client'

import React, { createContext, useContext } from 'react'
import { Preprint } from '../../../types/preprint'

const PreprintContext = createContext<Preprint | null>(null)

interface ProviderProps {
  children: React.ReactNode
  preprint: Preprint
}

export const PreprintProvider: React.FC<ProviderProps> = ({
  children,
  preprint,
}) => {
  return (
    <PreprintContext.Provider value={preprint}>
      {children}
    </PreprintContext.Provider>
  )
}

export const usePreprint = () => {
  const preprint = useContext(PreprintContext)

  return preprint
}
