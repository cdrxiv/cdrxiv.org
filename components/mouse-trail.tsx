'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface CursorPosition {
  x: number
  y: number
  id: string
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
          { x: event.clientX, y: event.clientY, id: uuidv4() },
          ...previousTrail.slice(0, 9),
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

  useEffect(() => {
    if (!isActive) {
      setCursorTrail([])
    }
  }, [isActive])

  return (
    <>
      {isActive && (
        <style jsx global>{`
          * {
            cursor: none !important;
          }
        `}</style>
      )}
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
                  width: '32px',
                  height: '32px',
                  backgroundImage: "url('/cursors/arrow_m.cur')",
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  opacity: 1 - index * 0.1,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}
        </AnimatePresence>
      </div>
    </>
  )
}

export default MouseTrail
