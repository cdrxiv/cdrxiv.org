'use client'

import { Box } from 'theme-ui'

import { useEffect, useRef, useState } from 'react'
import { Form, Link } from '../../../../components'
import { getAdditionalField } from '../../../../utils/data'
import { usePreprint } from '../preprint-context'

const Success = () => {
  const [decoration, setDecoration] = useState('₊˚⊹⋆')
  const timeout = useRef<NodeJS.Timeout | null>(null)
  const { preprint } = usePreprint()
  const type = getAdditionalField(preprint, 'Submission type')
  const printedType = (
    type === 'Both' ? 'article and data were' : type + ' was'
  ).toLowerCase()

  useEffect(() => {
    const animate = () => {
      timeout.current = setTimeout(() => {
        setDecoration((prev) => `${prev.slice(1)}${prev[0]}`)
        animate()
      }, 500)
    }
    animate()

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current)
      }
    }
  }, [])

  return (
    <Form>
      <Box sx={{ variant: 'text.monoCaps' }}>
        {decoration} Your {printedType} successfully submitted!{' '}
        {decoration.split('').reverse().join('')}
      </Box>

      <Link href='/' forwardArrow>
        Home
      </Link>
    </Form>
  )
}

export default Success
