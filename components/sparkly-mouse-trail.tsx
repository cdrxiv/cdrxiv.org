'use client'

import { AnimatePresence, motion, useAnimationFrame } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useThemeUI } from 'theme-ui'

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

const SparklyMouseTrail = ({ isActive }: SparklyMouseTrailProps) => {
  const [sparkles, setSparkles] = useState<SparklePosition[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const frameCount = useRef(0)
  const { theme } = useThemeUI()
  const color = theme?.colors?.blue as string

  const createSparkle = useCallback((x: number, y: number): SparklePosition => {
    const offsetX = (Math.random() - 0.5) * 100
    const offsetY = Math.random() * 50

    const initialDistance = Math.sqrt(offsetX * offsetX + offsetY * offsetY)

    return {
      x: x + offsetX,
      y: y + offsetY,
      id: Date.now() + Math.random() * 200,
      duration: Math.random() * 1500 + 1500,
      rotation: Math.random() * 360,
      size: Math.random() * 0.5 + 0.5,
      initialDistance,
    }
  }, [])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY })
  }, [])

  useEffect(() => {
    if (isActive) {
      window.addEventListener('mousemove', handleMouseMove)
    }
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove, isActive])

  useAnimationFrame(() => {
    if (!isActive) return

    frameCount.current += 1

    if (frameCount.current % 5 === 0) {
      const newSparkles = Array.from({ length: 3 }, () =>
        createSparkle(mousePosition.x, mousePosition.y),
      )
      setSparkles((prevSparkles) => [
        ...newSparkles,
        ...prevSparkles.slice(0, 49),
      ])
    }

    setSparkles((prevSparkles) =>
      prevSparkles.filter(
        (sparkle) => Date.now() - sparkle.id < sparkle.duration,
      ),
    )
  })

  if (!isActive) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      <AnimatePresence>
        {sparkles.map((sparkle) => {
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
                x: sparkle.x + (Math.random() - 0.5) * 50,
                y: sparkle.y + 100,
                rotate: sparkle.rotation + 360,
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
                pointerEvents: 'none',
              }}
            >
              <PlusSvg color={color} size={24 * sparkle.size} />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default SparklyMouseTrail
