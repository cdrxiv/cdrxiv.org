'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'

interface SparklePosition {
  x: number
  y: number
  id: number
  size: number
  color: string
}

interface SparklyMouseTrailProps {
  isActive: boolean
}

const SparklyMouseTrail= ({
  isActive,
}: SparklyMouseTrailProps) =>{
  const [sparkles, setSparkles] = useState<SparklePosition[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (isActive) {
        const newSparkles = Array.from({ length: 5 }, () => ({
          x: event.clientX + (Math.random() - 0.5) * 20,
          y: event.clientY + (Math.random() - 0.5) * 20,
          id: Date.now() + Math.random(),
          size: Math.random() * 4 + 1,
          color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        }))
        setSparkles((prevSparkles) => [
          ...newSparkles,
          ...prevSparkles.slice(0, 45),
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

  if (!isClient) {
    return null
  }

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
          sparkles.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              initial={{ opacity: 1, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: sparkle.x,
                top: sparkle.y,
                width: sparkle.size,
                height: sparkle.size,
                backgroundColor: sparkle.color,
                borderRadius: '50%',
              }}
            />
          ))}
      </AnimatePresence>
    </div>
  )
}

export default SparklyMouseTrail