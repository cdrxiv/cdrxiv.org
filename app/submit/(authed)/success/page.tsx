'use client'

import { Box } from 'theme-ui'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { Form, Link } from '../../../../components'

const Success = () => {
  const [decoration, setDecoration] = useState('₊˚⊹⋆')
  const searchParams = useSearchParams()
  const timeout = useRef<NodeJS.Timeout | null>(null)
  const type = searchParams.get('type') ?? 'work'
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
