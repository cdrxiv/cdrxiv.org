'use client'

import { useEffect, useState } from 'react'
import { Box, Global } from 'theme-ui'

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [cursorType, setCursorType] = useState('default')

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const updateCursorType = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('button')
      ) {
        setCursorType('hover')
      } else {
        setCursorType('default')
      }
    }

    window.addEventListener('mousemove', updatePosition)
    window.addEventListener('mouseover', updateCursorType)

    return () => {
      window.removeEventListener('mousemove', updatePosition)
      window.removeEventListener('mouseover', updateCursorType)
    }
  }, [])

  return (
    <>
      <Global
        styles={{
          'html, body, *': {
            cursor: 'none !important',
          },
          'a, button': {
            cursor: 'none !important',
          },
        }}
      />
      <Box
        as='div'
        sx={{
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 9999,
          left: 0,
          top: 0,
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          width: '32px',
          height: '32px',
          backgroundImage:
            cursorType === 'hover'
              ? "url('/cursors/harrow.cur')"
              : "url('/cursors/arrow_m.cur')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
        }}
      />
    </>
  )
}

export default CustomCursor
