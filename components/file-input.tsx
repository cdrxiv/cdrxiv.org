import React, { useCallback, useRef } from 'react'
import { Box, Flex } from 'theme-ui'

import Button from './button'
import Link from './link'

export type FileInputValue =
  | {
      persisted: true
      url: string
      mime_type: null
      original_filename: string
      file: null
    }
  | {
      persisted: false
      url: null
      mime_type: string
      original_filename: string
      file: Blob
    }

type Props = {
  accept?: string
  file?: FileInputValue | null
  description?: React.ReactNode
  onChange: (file: FileInputValue | null) => void
}
const FileInput: React.FC<Props> = ({
  accept = 'any',
  file,
  description,
  onChange,
}) => {
  const ref = useRef<HTMLInputElement>(null)
  const handleChange = useCallback(() => {
    if (ref.current?.files && ref.current.files[0]) {
      const currentFile = ref.current.files[0]
      onChange({
        persisted: false,
        mime_type: currentFile.type,
        original_filename: currentFile.name,
        file: currentFile,
        url: null,
      })
    }
  }, [onChange])

  const handleClear = useCallback(() => {
    onChange(null)
    ref.current?.value && (ref.current.value = '')
  }, [onChange])

  return (
    <div>
      <Flex sx={{ alignItems: 'baseline', gap: 3 }}>
        <Button as='label' sx={{ flexShrink: 0 }}>
          Choose file
          <input
            name='file'
            ref={ref}
            type='file'
            accept={accept}
            hidden
            onChange={handleChange}
          />
        </Button>

        {file && (
          <Box
            as='span'
            sx={{ variant: 'text.monoCaps', textTransform: 'none' }}
          >
            {file.original_filename}&nbsp;
            <Link
              sx={{
                variant: 'text.monoCaps',
                textDecoration: 'none',
              }}
              onClick={handleClear}
            >
              (X)
            </Link>
          </Box>
        )}

        {!file && description && (
          <Box sx={{ variant: 'text.mono' }}>{description}</Box>
        )}
      </Flex>
    </div>
  )
}

export default FileInput
