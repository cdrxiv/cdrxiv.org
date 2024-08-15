'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Preprint, Preprints } from '../../../types/preprint'
import SelectPreprint from './select-preprint'
import { useParams } from 'next/navigation'

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
  const params = useParams()
  const [value, setValue] = useState(() => {
    if (preprints.length === 1) {
      return preprints[0]
    } else if (params.preprint) {
      return preprints.find((p) => p.pk === Number(params.preprint[0])) ?? null
    } else {
      return null
    }
  })

  useEffect(() => {
    if (params.preprint?.length === 1) {
      if (!value || value.pk !== Number(params.preprint[0])) {
        const updatedPreprint = preprints.find(
          (p) => p.pk === Number(params.preprint[0]),
        )
        if (updatedPreprint) {
          setValue(updatedPreprint)
        }
      }
    }
  }, [params, value, preprints])

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
