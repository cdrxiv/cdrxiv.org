'use client'

import React, { useCallback, useRef, useState } from 'react'
import { Box, Flex } from 'theme-ui'

import { Button, Link } from '../../../../components'

export type CurrentFile =
  | {
      persisted: true
      mime_type: null
      original_filename: string
      file: null
    }
  | {
      persisted: false
      mime_type: string
      original_filename: string
      file: Blob
    }
type Props = {
  file?: CurrentFile | null
  onSubmit: (file: CurrentFile | null) => Promise<CurrentFile | null>
  onClear: () => void
}
const FileInput: React.FC<Props> = ({ file: fileProp, onSubmit, onClear }) => {
  const ref = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<CurrentFile | null>(fileProp ?? null)
  const [error, setError] = useState<string>()
  const handleChange = useCallback(() => {
    onSubmit(null)
    if (ref.current?.files && ref.current.files[0]) {
      const currentFile = ref.current.files[0]
      setFile({
        persisted: false,
        mime_type: currentFile.type,
        original_filename: currentFile.name,
        file: currentFile,
      })
    }
  }, [onSubmit])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (file && !file.persisted) {
        setError(undefined)

        try {
          const result = await onSubmit(file)
          setFile(result)
        } catch (e: any) {
          setError(e.message ?? 'Error saving file.')
        }
      }
    },
    [file, onSubmit],
  )

  const handleClear = useCallback(() => {
    setFile(null)
    onClear()
  }, [onClear])

  return (
    <form onSubmit={handleSubmit}>
      <Flex sx={{ alignItems: 'baseline', gap: 3 }}>
        <Button
          sx={{
            display: !file || file.persisted ? 'none' : 'inherit',
            flexShrink: 0,
          }}
        >
          Upload file
        </Button>
        <Button
          as='label'
          sx={{
            display: file && !file.persisted ? 'none' : 'inherit',
            flexShrink: 0,
          }}
        >
          {file?.persisted ? 'Replace file' : 'Choose file'}
          <input
            name='file'
            ref={ref}
            type='file'
            accept='application/pdf'
            hidden
            onChange={handleChange}
          />
        </Button>

        {file && (
          <Link
            sx={{ variant: 'text.monoCaps', textTransform: 'none' }}
            onClick={handleClear}
          >
            {file.original_filename}
            <Box
              as='span'
              sx={{ display: 'inline-block', textDecoration: 'none' }}
            >
              &nbsp;(X)
            </Box>
          </Link>
        )}
      </Flex>
      {error && <Box sx={{ variant: 'text.mono', color: 'red' }}>{error}</Box>}
    </form>
  )
}

export default FileInput
