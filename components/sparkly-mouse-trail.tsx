'use client'

import { AnimatePresence, motion, useAnimationFrame } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'

interface SparklePosition {
  x: number
  y: number
  id: number
  size: number
  duration: number
  rotation: number
  initialDistance: number
}

interface SparklyMouseTrailProps {
  isActive: boolean
}

const PlusSvg = ({ color, size }: { color: string; size: number }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill={color}
    stroke={color}
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M5 12h14' />
    <path d='M12 5v14' />
  </svg>
)

export default function SparklyMouseTrail({
  isActive,
}: SparklyMouseTrailProps) {
  const [sparkles, setSparkles] = useState<SparklePosition[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const frameCount = useRef(0)
  const createSparkle = useCallback((x: number, y: number): SparklePosition => {
    const offsetX = (Math.random() - 0.5) * 200
    const offsetY = (Math.random() - 0.5) * 200

    const initialDistance = Math.sqrt(offsetX * offsetX + offsetY * offsetY)

    return {
      x: x + offsetX,
      y: y + offsetY,
      id: Date.now() + Math.random() * 200,
      duration: Math.random() * 2000 + 2000,
      rotation: Math.random() * 360,
      size: Math.random() * 0.5 + 0.5,
      initialDistance,
    }
  }, [])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  useAnimationFrame(() => {
    frameCount.current += 1

    // create new sparkles every 5 frames
    if (frameCount.current % 5 === 0) {
      const newSparkles = Array.from({ length: 3 }, () =>
        createSparkle(mousePosition.x, mousePosition.y),
      )
      setSparkles((prevSparkles) => [...newSparkles, ...prevSparkles])
    }
    // remove sparkles that have exceeded their duration
    setSparkles((prevSparkles) =>
      prevSparkles.filter(
        (sparkle) => Date.now() - sparkle.id < sparkle.duration,
      ),
    )
  })

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 999999,
        border: '2px solid red', // Debug border
      }}
    >
      <AnimatePresence>
        {isActive &&
          sparkles.map((sparkle) => {
            const distance = Math.sqrt(
              Math.pow(mousePosition.x - sparkle.x, 2) +
                Math.pow(mousePosition.y - sparkle.y, 2),
            )
            const scale = Math.max(0.05, 1 - (distance / 300) ** 1.5) // Enhanced depth effect

            return (
              <motion.div
                key={sparkle.id}
                initial={{
                  opacity: 1,
                  scale: sparkle.size,
                  x: sparkle.x,
                  y: sparkle.y,
                  rotate: sparkle.rotation,
                }}
                animate={{
                  opacity: 0,
                  scale: scale * sparkle.size,
                  x: sparkle.x + (Math.random() - 0.5) * 100,
                  y: sparkle.y + 200,
                  rotate: sparkle.rotation + 720,
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  duration: sparkle.duration / 1000,
                  ease: 'easeOut',
                }}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                }}
              >
                <PlusSvg color='red' size={24 * sparkle.size} />
              </motion.div>
            )
          })}
      </AnimatePresence>
    </div>
  )
}
