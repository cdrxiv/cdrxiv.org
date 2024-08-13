'use client'

import { useCallback, useRef, useState } from 'react'
import { Box, Flex } from 'theme-ui'

import StyledButton from '../../../../components/button'
import StyledLink from '../../../../components/link'
import { createPreprintFile, updatePreprint } from '../actions'
import { usePreprint } from '../preprint-context'

const UploadButton = () => {
  const { preprint } = usePreprint()
  const ref = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)

  const handleChange = useCallback(() => {
    if (ref.current?.files && ref.current.files[0]) {
      setFile(ref.current?.files[0])
    }
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (file) {
        const formData = new FormData(e.target)
        // const arrayBuffer = await file.arrayBuffer()

        // if (arrayBuffer) {
        //   formData.set('file', arrayBuffer)
        // }
        formData.set('preprint', String(preprint?.pk))
        formData.set('mime_type', file.type)
        formData.set('original_filename', file.name)
        console.log({
          preprint: preprint?.pk,
          // file: arrayBuffer,
          mime_type: file.type,
          original_filename: file.name,
        })
        debugger

        createPreprintFile(formData)
        // createPreprintFile({
        //   preprint: preprint?.pk,
        //   file: arrayBuffer,
        //   mime_type: file.type,
        //   original_filename: file.name,
        // })
      }
    },
    [file, preprint?.pk],
  )

  console.log(file)
  return (
    <form onSubmit={handleSubmit}>
      <Flex sx={{ alignItems: 'baseline', gap: 3 }}>
        <StyledButton sx={{ display: !file ? 'none' : 'inherit' }}>
          Upload file
        </StyledButton>
        <StyledButton as='label' sx={{ display: file ? 'none' : 'inherit' }}>
          Choose file
          <input
            name='file'
            ref={ref}
            type='file'
            accept='application/pdf'
            hidden
            onChange={handleChange}
          />
        </StyledButton>

        {file && (
          <StyledLink
            sx={{ variant: 'text.monoCaps', textTransform: 'none' }}
            onClick={() => setFile(null)}
          >
            {file.name}
            <Box
              as='span'
              sx={{ display: 'inline-block', textDecoration: 'none' }}
            >
              &nbsp;(X)
            </Box>
          </StyledLink>
        )}
      </Flex>
    </form>
  )
}

export default UploadButton
