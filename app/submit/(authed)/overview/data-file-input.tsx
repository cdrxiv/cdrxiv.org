'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Flex, Input } from 'theme-ui'

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
import FileInput from './file-input'
import { Link } from '../../../../components'
import { CurrentFile } from './utils'

type Props = {
  file?: CurrentFile | null
  setFile: (file: CurrentFile | null) => void
  externalFile: SupplementaryFile | null
  setExternalFile: (file: SupplementaryFile | null) => void
}
const DataFileInput: React.FC<Props> = ({
  file: fileProp,
  setFile: setFileProp,
  externalFile,
  setExternalFile,
}) => {
  const [mode, setMode] = useState<'upload' | 'link'>(
    externalFile ? 'link' : 'upload',
  )
  const { preprint, setPreprint } = usePreprint()
  const [deposition, setDeposition] = useState<Deposition | null>(null)
  const [loading, setLoading] = useState<boolean>(fileProp ? true : false)

  useEffect(() => {
    if (fileProp?.url) {
      fetchDataDeposition(fileProp?.url)
        .then((deposition) => {
          setDeposition(deposition)
          setLoading(false)
        })
        .catch(() => {
          // TODO: remove from supplementary files
          setFileProp(null)
        })
    }
  }, [fileProp?.url, setFileProp])

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

  const fileDisplay = useMemo(
    () =>
      deposition && deposition.files[0]
        ? {
            persisted: true as const,
            mime_type: null,
            original_filename: deposition.files[0].filename,
            url: deposition.files[0].links.download,
            file: null,
          }
        : fileProp,
    [fileProp, deposition],
  )

  console.log(fileProp, fileDisplay)

  if (loading) {
    return 'Loading...'
  } else if (mode === 'upload') {
    return (
      <>
        <FileInput
          file={fileDisplay}
          onChange={setFileProp}
          description={
            <>
              Or{' '}
              <Link
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
