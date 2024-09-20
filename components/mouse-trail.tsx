'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'

interface CursorPosition {
  x: number
  y: number
  id: number
}

interface CursorTrailProps {
  isActive: boolean
}

const MouseTrail = ({ isActive }: CursorTrailProps) => {
  const [cursorTrail, setCursorTrail] = useState<CursorPosition[]>([])

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (isActive) {
        setCursorTrail((previousTrail) => [
          { x: event.clientX, y: event.clientY, id: Date.now() },
          ...previousTrail.slice(0, 10),
        ])
      }
    },
    [isActive],
  )

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [handleMouseMove])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <AnimatePresence>
        {isActive &&
          cursorTrail.map((cursor, index) => (
            <motion.div
              key={cursor.id}
              initial={{ opacity: 0.8, scale: 1 }}
              animate={{ opacity: 0, scale: 0.8 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: cursor.x,
                top: cursor.y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                height='32'
                viewBox='0 0 32 32'
                width='32'
                style={{
                  opacity: 1 - index * 0.1, // Fade out based on position in the trail
                }}
              >
                <g fill='none' fillRule='evenodd' transform='translate(10 7)'>
                  <path
                    d='m6.148 18.473 1.863-1.003 1.615-.839-2.568-4.816h4.332l-11.379-11.408v16.015l3.316-3.221z'
                    fill='#fff'
                  />
                  <path
                    d='m6.431 17 1.765-.941-2.775-5.202h3.604l-8.025-8.043v11.188l2.53-2.442z'
                    fill='#000'
                  />
                </g>
              </svg>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  )
}

export default MouseTrail
