'use client'

import React, { useCallback, useMemo } from 'react'

import { createPreprintFile } from '../actions'
import { usePreprint } from '../preprint-context'
import { PreprintFile } from '../../../../types/preprint'
import FileInput, { CurrentFile } from './file-input'

type Props = {
  file?: PreprintFile | null
  setFile: (file: PreprintFile | null) => void
}
const PreprintFileInput: React.FC<Props> = ({
  file: fileProp,
  setFile: setFileProp,
}) => {
  const { preprint } = usePreprint()

  const handleSubmit = useCallback(
    async (file: CurrentFile | null) => {
      if (file && file.file) {
        const formData = new FormData()

        formData.set('file', file.file)
        formData.set('preprint', String(preprint?.pk))
        formData.set('mime_type', file.mime_type)
        formData.set('original_filename', file.original_filename)

        const result = await createPreprintFile(formData)
        setFileProp(result)
        return {
          persisted: true as const,
          mime_type: result.mime_type,
          original_filename: result.original_filename,
          file: null,
        } as CurrentFile
      } else {
        setFileProp(null)
        return null
      }
    },
    [preprint?.pk, setFileProp],
  )

  const file = useMemo(
    () =>
      fileProp
        ? {
            persisted: true as const,
            mime_type: fileProp.mime_type,
            original_filename: fileProp.original_filename,
            file: null,
          }
        : null,
    [fileProp],
  )

  return <FileInput file={file} onSubmit={handleSubmit} />
}

export default PreprintFileInput
