'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'

import {
  createDataDeposition,
  createDataDepositionFile,
  deleteZenodoEntity,
  fetchDataDeposition,
  updatePreprint,
} from '../actions'
import { usePreprint } from '../preprint-context'
import { SupplementaryFile } from '../../../../types/preprint'
import { Deposition } from '../../../../types/zenodo'
import FileInput, { CurrentFile } from './file-input'

type Props = {
  file?: SupplementaryFile | 'loading' | null
  setFile: (file: SupplementaryFile | null | 'loading') => void
}
const DataFileInput: React.FC<Props> = ({
  file: fileProp,
  setFile: setFileProp,
}) => {
  const { preprint, setPreprint } = usePreprint()
  const [deposition, setDeposition] = useState<Deposition | null>(null)
  const [loading, setLoading] = useState<boolean>(fileProp ? true : false)

  const fileUrl = fileProp !== 'loading' && fileProp?.url
  useEffect(() => {
    if (fileUrl) {
      fetchDataDeposition(fileUrl)
        .then((deposition) => {
          setDeposition(deposition)
          setLoading(false)
        })
        .catch(() => {
          // TODO: remove from supplementary files
        })
    }
  }, [fileUrl])

  const handleSubmit = useCallback(
    async (file: CurrentFile | null) => {
      if (file && file.file) {
        let activeDeposition
        if (!deposition) {
          // Create a new deposition if one doesn't already exist
          const dep = await createDataDeposition()
          const supplementaryFile = {
            label: 'CDRXIV_DATA_DRAFT',
            url: dep.links.self,
          }

          // Add file to preprint's supplementary_files list
          const updatedPreprint = await updatePreprint(preprint, {
            supplementary_files: [
              ...preprint.supplementary_files,
              supplementaryFile,
            ],
          })

          activeDeposition = dep
          setDeposition(dep)
          setFileProp(supplementaryFile)
          setPreprint(updatedPreprint)
        } else {
          if (deposition.files.length > 0) {
            await Promise.all([
              deposition.files.map((f) => deleteZenodoEntity(f.links.self)),
            ])
          }
          activeDeposition = deposition
        }

        const formData = new FormData()
        formData.set('name', file.original_filename)
        formData.set('file', file.file)

        await createDataDepositionFile(activeDeposition.id, formData)
        const updatedDeposition = await fetchDataDeposition(
          activeDeposition.links.self,
        )
        setDeposition(updatedDeposition)
        return {
          persisted: true as const,
          mime_type: null,
          original_filename: file.original_filename,
          file: null,
        } as CurrentFile
      } else {
        setFileProp('loading')
        return null
      }
    },
    [preprint, setFileProp, deposition, setPreprint],
  )

  const file = useMemo(
    () =>
      deposition && deposition.files[0]
        ? {
            persisted: true as const,
            mime_type: null,
            original_filename: deposition.files[0].filename,
            file: null,
          }
        : null,
    [deposition],
  )

  const handleClear = useCallback(() => {
    setFileProp(null)
  }, [setFileProp])

  return loading ? (
    'Loading...'
  ) : (
    <>
      <FileInput file={file} onSubmit={handleSubmit} onClear={handleClear} />
    </>
  )
}

export default DataFileInput
