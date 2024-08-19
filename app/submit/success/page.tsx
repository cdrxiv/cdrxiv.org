'use client'

import { Box, Flex } from 'theme-ui'

import { Link } from '../../../components'
import { useEffect, useRef, useState } from 'react'

const Success = () => {
  const [decoration, setDecoration] = useState('₊˚⊹⋆')
  const timeout = useRef<NodeJS.Timeout | null>(null)
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
    <Flex sx={{ flexDirection: 'column', gap: 7 }}>
      <Box sx={{ variant: 'text.monoCaps' }}>
        {decoration} Your paper was successfully submitted!{' '}
        {decoration.split('').reverse().join('')}
      </Box>

      <Link href='/' forwardArrow>
        Home
      </Link>
    </Flex>
  )
}

export default Success
