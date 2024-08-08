'use client'

import React, { createContext, useContext, useState } from 'react'
import { Preprint } from '../../../types/preprint'

const PreprintContext = createContext<{
  preprint: Preprint | null
  setPreprint: (preprint: Preprint) => void
}>({ preprint: null, setPreprint: () => {} })

interface ProviderProps {
  children: React.ReactNode
  preprint: Preprint
}

export const PreprintProvider: React.FC<ProviderProps> = ({
  children,
  preprint,
}) => {
  const [value, setValue] = useState(preprint)
  return (
    <PreprintContext.Provider
      value={{ preprint: value, setPreprint: setValue }}
    >
      {children}
    </PreprintContext.Provider>
  )
}

export const usePreprint = () => {
  const { preprint, setPreprint } = useContext(PreprintContext)

  if (!preprint) {
    throw new Error('Tried to usePreprint() before context was instantiated')
  }

  return { preprint, setPreprint }
}
