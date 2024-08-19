'use client'

import React, { createContext, useContext, useState } from 'react'
import { Preprint, Preprints } from '../../../types/preprint'
import SelectPreprint from './select-preprint'

const PreprintContext = createContext<{
  preprint: Preprint | null
  setPreprint: (preprint: Preprint) => void
}>({ preprint: null, setPreprint: () => {} })

interface ProviderProps {
  children: React.ReactNode
  preprints: Preprints
}

export const PreprintProvider: React.FC<ProviderProps> = ({
  children,
  preprints,
}) => {
  const [value, setValue] = useState(
    preprints.length === 1 ? preprints[0] : null,
  )
  return (
    <PreprintContext.Provider
      value={{ preprint: value, setPreprint: setValue }}
    >
      {value ? (
        children
      ) : (
        <SelectPreprint preprints={preprints} setPreprint={setValue} />
      )}
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
