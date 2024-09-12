'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Preprint, PreprintFile, Preprints } from '../../../types/preprint'
import SelectPreprint from './select-preprint'
import { track } from '../../../utils/tracking'

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
  newlyCreated: boolean
}

export const PreprintProvider: React.FC<ProviderProps> = ({
  children,
  preprints,
  files: filesProp,
  newlyCreated,
}) => {
  const [value, setValue] = useState(
    preprints.length === 1 ? preprints[0] : null,
  )
  const [files, setFiles] = useState(() =>
    filesProp.filter((f) => f.preprint === value?.pk),
  )
  const initializationEvent = useRef<Record<string, any>>(
    value
      ? {
          preprint: value?.pk,
          user: value?.owner,
        }
      : null,
  )

  useEffect(() => {
    setFiles(filesProp.filter((f) => f.preprint === value?.pk))
  }, [filesProp, value?.pk])

  useEffect(() => {
    if (newlyCreated && initializationEvent.current) {
      track('preprint_created', initializationEvent.current)
    }
  }, [newlyCreated])

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
