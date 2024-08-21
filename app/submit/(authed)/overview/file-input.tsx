'use client'

import React, { useCallback, useRef, useState } from 'react'
import { Box, Flex } from 'theme-ui'

import { Button, Link } from '../../../../components'

export type CurrentFile =
  | {
      persisted: true
      mime_type: string
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
}
const FileInput: React.FC<Props> = ({ file: fileProp, onSubmit }) => {
  const ref = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<CurrentFile | null>(fileProp ?? null)
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
        const result = await onSubmit(file)
        setFile(result)
      }
    },
    [file, onSubmit],
  )

  const handleClear = useCallback(() => {
    setFile(null)
    onSubmit(null)
  }, [onSubmit])

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
    </form>
  )
}

export default FileInput
