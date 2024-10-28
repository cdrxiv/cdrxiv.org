'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface SparkleProps {
  id: string
  x: number
  y: number
  size: number
  duration: number
  removeSparkle: (id: string) => void
}

const Sparkle = ({ id, x, y, size, duration, removeSparkle }: SparkleProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeSparkle(id)
    }, duration)
    return () => clearTimeout(timer)
  }, [id, duration, removeSparkle])

  return (
    <motion.div
      initial={{
        scale: size,
        x: x,
        y: y,
      }}
      animate={{
        scale: 0,
        x: x + (Math.random() - 0.5) * 50,
        y: y + 100,
      }}
      transition={{
        duration: duration / 1000,
        ease: 'easeOut',
      }}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        pointerEvents: 'none',
        fontSize: `${16 * size}px`,
      }}
    >
      +
    </motion.div>
  )
}

interface SparkleData {
  id: string
  x: number
  y: number
  size: number
  duration: number
}

const SparklyMouseTrail = () => {
  const [sparkles, setSparkles] = useState<SparkleData[]>([])
  const [isMouseActive, setIsMouseActive] = useState(false)
  const mousePosition = useRef({ x: 0, y: 0 })
  const frameCount = useRef(0)

  const handleMouseMove = useCallback((event: MouseEvent) => {
    mousePosition.current = { x: event.clientX, y: event.clientY }
    setIsMouseActive(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsMouseActive(false)
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave])

  useEffect(() => {
    const interval = setInterval(() => {
      frameCount.current += 1
      if (frameCount.current % 3 === 0 && isMouseActive) {
        const newSparkles = Array.from({ length: 5 }, () => {
          const id = uuidv4()
          const size = Math.random() * 0.5 + 0.5
          const duration = Math.random() * 1500 + 1500
          const offsetX = (Math.random() - 0.5) * 100
          const offsetY = Math.random() * 50
          const x = mousePosition.current.x + offsetX
          const y = mousePosition.current.y + offsetY

          return {
            id,
            x,
            y,
            size,
            duration,
          }
        })
        setSparkles((prevSparkles) => [...prevSparkles, ...newSparkles])
      }
    }, 16)

    return () => clearInterval(interval)
  }, [isMouseActive])

  const removeSparkle = useCallback((id: string) => {
    setSparkles((prevSparkles) =>
      prevSparkles.filter((sparkle) => sparkle.id !== id),
    )
  }, [])

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
        {sparkles.map((sparkle) => (
          <Sparkle
            key={sparkle.id}
            id={sparkle.id}
            x={sparkle.x}
            y={sparkle.y}
            size={sparkle.size}
            duration={sparkle.duration}
            removeSparkle={removeSparkle}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default SparklyMouseTrail
