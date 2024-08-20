'use client'

import React, { useCallback, useRef, useState } from 'react'
import { Box, Flex } from 'theme-ui'

import { Button, Link } from '../../../../components'
import { createPreprintFile } from '../actions'
import { usePreprint } from '../preprint-context'
import { PreprintFile, PreprintFileParams } from '../../../../types/preprint'

type Props = {
  file?: PreprintFile
}
const UploadButton: React.FC<Props> = ({ file: fileProp }) => {
  const { preprint } = usePreprint()
  const ref = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<PreprintFileParams | PreprintFile | null>(
    fileProp ?? null,
  )
  const handleChange = useCallback(() => {
    if (ref.current?.files && ref.current.files[0]) {
      const currentFile = ref.current.files[0]
      currentFile.arrayBuffer().then((arrayBuffer) =>
        setFile({
          preprint: preprint.pk,
          mime_type: currentFile.type,
          original_filename: currentFile.name,
          file: arrayBuffer,
        }),
      )
    }
  }, [preprint])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (file) {
        const formData = new FormData(e.target)

        //   formData.set('file', file.file)
        formData.set('preprint', String(preprint?.pk))
        formData.set('mime_type', file.mime_type)
        formData.set('original_filename', file.original_filename)

        createPreprintFile(formData)
        // createPreprintFile(file)
      }
    },
    [file, preprint?.pk],
  )

  return (
    <form onSubmit={handleSubmit}>
      <Flex sx={{ alignItems: 'baseline', gap: 3 }}>
        <Button
          sx={{
            display: !file || file.pk ? 'none' : 'inherit',
            flexShrink: 0,
          }}
        >
          Upload file
        </Button>
        <Button
          as='label'
          sx={{ display: file && !file.pk ? 'none' : 'inherit', flexShrink: 0 }}
        >
          {file?.pk ? 'Replace file' : 'Choose file'}
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
            onClick={() => setFile(null)}
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

export default UploadButton
