'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Preprint, PreprintFile, Preprints } from '../../types/preprint'
import SelectPreprint from './select-preprint'
import useTracking from '../../hooks/use-tracking'
import PaneledPage from '../../components/layouts/paneled-page'

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
  const track = useTracking()
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
  }, [newlyCreated, track])

  useEffect(() => {
    if (!preprints[0]) {
      return
    }

    // Update reference to new preprint if old preprint has been submitted
    setValue((prev) => (prev?.pk === preprints[0].pk ? prev : preprints[0]))
  }, [preprints[0]?.pk])

  return (
    <PreprintContext.Provider
      value={{ preprint: value, setPreprint: setValue, files, setFiles }}
    >
      {value ? (
        children
      ) : (
        <PaneledPage title='Submit'>
          <SelectPreprint preprints={preprints} setPreprint={setValue} />
        </PaneledPage>
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
