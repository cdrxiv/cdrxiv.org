'use client'

import React, { useState } from 'react'
import { Box, Flex, Input } from 'theme-ui'

import { SupplementaryFile } from '../../../../types/preprint'
import {
  Link,
  FileInput,
  FileInputValue,
  Loading,
} from '../../../../components'

type Props = {
  file?: FileInputValue | null
  setFile: (file: FileInputValue | null) => void
  externalFile: SupplementaryFile | null
  setExternalFile: (file: SupplementaryFile | null) => void
  loading: boolean
}
const DataFileInput: React.FC<Props> = ({
  file: fileProp,
  setFile: setFileProp,
  externalFile,
  setExternalFile,
  loading,
}) => {
  const [mode, setMode] = useState<'upload' | 'link'>(
    externalFile ? 'link' : 'upload',
  )

  if (loading) {
    return <Loading />
  } else if (mode === 'upload') {
    return (
      <>
        <FileInput
          file={fileProp}
          onChange={setFileProp}
          description={
            <>
              Or{' '}
              <Link
                as='button'
                onClick={() => {
                  setMode('link')
                  setFileProp(null)
                  setExternalFile({ url: '', label: '' })
                }}
                sx={{ variant: 'text.mono' }}
              >
                enter link
              </Link>{' '}
              to externally hosted dataset.
            </>
          }
        />
      </>
    )
  } else {
    return (
      <Flex
        sx={{
          flexDirection: ['column', 'column', 'row', 'row'],
          alignItems: ['flex-start', 'flex-start', 'flex-end', 'flex-end'],
          gap: 3,
        }}
      >
        <Box as='label' sx={{ variant: 'text.mono' }}>
          Label
          <Input
            value={externalFile?.label ?? ''}
            onChange={(e) =>
              setExternalFile({
                label: e.target.value,
                url: externalFile?.url ?? '',
              })
            }
          />
        </Box>
        <Box as='label' sx={{ variant: 'text.mono' }}>
          URL
          <Input
            value={externalFile?.url ?? ''}
            onChange={(e) =>
              setExternalFile({
                url: e.target.value,
                label: externalFile?.label ?? '',
              })
            }
          />
        </Box>
        <Box sx={{ variant: 'text.mono', flexShrink: 0, pb: '10px' }}>
          Or{' '}
          <Link
            onClick={() => {
              setMode('upload')
              setExternalFile(null)
            }}
            sx={{ variant: 'text.mono' }}
          >
            upload file
          </Link>{' '}
          to CDRXIV.
        </Box>
      </Flex>
    )
  }
}

export default DataFileInput
