'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Preprint, PreprintFile, Preprints } from '../../../types/preprint'
import SelectPreprint from './select-preprint'

const PreprintContext = createContext<{
  preprint: Preprint | null
  setPreprint: (preprint: Preprint) => void
  files: PreprintFile[]
  setFiles: (files: PreprintFile[]) => void
}>({ preprint: null, setPreprint: () => {}, files: [], setFiles: () => {} })

interface ProviderProps {
  children: React.ReactNode
  preprints: Preprints
  files: PreprintFile[]
}

export const PreprintProvider: React.FC<ProviderProps> = ({
  children,
  preprints,
  files: filesProp,
}) => {
  const [value, setValue] = useState(
    preprints.length === 1 ? preprints[0] : null,
  )
  const [files, setFiles] = useState(() =>
    filesProp.filter((f) => f.preprint === value?.pk),
  )

  useEffect(() => {
    setFiles(filesProp.filter((f) => f.preprint === value?.pk))
  }, [filesProp, value])

  return (
    <PreprintContext.Provider
      value={{ preprint: value, setPreprint: setValue, files, setFiles }}
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

export const usePreprintFiles = () => {
  const { files, setFiles } = useContext(PreprintContext)

  if (!files) {
    throw new Error('Tried to usePreprint() before context was instantiated')
  }

  return { files, setFiles }
}
