'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Box } from 'theme-ui'

import {
  createDataDeposition,
  createDataDepositionFile,
  fetchDataDeposition,
  updatePreprint,
} from '../actions'
import { usePreprint } from '../preprint-context'
import { SupplementaryFile } from '../../../../types/preprint'
import { Deposition } from '../../../../types/zenodo'
import FileInput, { CurrentFile } from './file-input'

type Props = {
  file?: SupplementaryFile | null
  setFile: (file: SupplementaryFile | null) => void
}
const DataFileInput: React.FC<Props> = ({
  file: fileProp,
  setFile: setFileProp,
}) => {
  const { preprint } = usePreprint()
  const [deposition, setDeposition] = useState<Deposition | null>(null)
  const [loading, setLoading] = useState<boolean>(fileProp ? true : false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (fileProp?.url) {
      fetchDataDeposition(fileProp.url).then((deposition) => {
        setDeposition(deposition)
        setLoading(false)
      })
    }
  }, [fileProp?.url])

  const handleSubmit = useCallback(
    async (file: CurrentFile | null) => {
      if (file && file.file) {
        let depositionId
        try {
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

            depositionId = dep.id
            setDeposition(dep)
            setFileProp(supplementaryFile)
            // TODO: setPreprint(updatedPreprint)
          } else {
            depositionId = deposition.id
          }

          const formData = new FormData()
          formData.set('name', file.original_filename)
          formData.set('file', file.file)

          await createDataDepositionFile(depositionId, formData)
          return {
            persisted: true as const,
            mime_type: null,
            original_filename: file.original_filename,
            file: null,
          } as CurrentFile
        } catch (e: any) {
          setError(e.message ?? 'Error saving data file.')
          return file
        }
      } else {
        // TODO (maybe)
        // delete deposition?
        // clear supplementary_files entry
        setFileProp(null)
        return null
      }
    },
    [preprint, setFileProp, deposition],
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

  return loading ? (
    'Loading...'
  ) : (
    <>
      <FileInput file={file} onSubmit={handleSubmit} />
      {error && <Box sx={{ variant: 'text.mono', color: 'red' }}>{error}</Box>}
    </>
  )
}

export default DataFileInput
