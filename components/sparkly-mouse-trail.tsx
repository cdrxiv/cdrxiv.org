'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

interface SparklePosition {
  x: number
  y: number
  id: number
  size: number
  color: string
  duration: number
}

interface SparklyMouseTrailProps {
  isActive: boolean
}

const SparklyMouseTrail = ({ isActive }: SparklyMouseTrailProps) => {
  const [sparkles, setSparkles] = useState<SparklePosition[]>([])
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 700 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  useEffect(() => {
    const createSparkle = () => ({
      id: Math.random(),
      x: (Math.random() - 0.5) * 100,
      y: (Math.random() - 0.5) * 100,
      size: Math.random() * 4 + 1,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      duration: Math.random() * 2 + 1,
    })

    const intervalId = setInterval(() => {
      setSparkles((prevSparkles) => {
        const newSparkles = [...prevSparkles, createSparkle()]
        if (newSparkles.length > 100) {
          newSparkles.shift()
        }
        return newSparkles
      })
    }, 50)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 999999,
      }}
    >
      <motion.div
        style={{
          x: springX,
          y: springY,
          width: '1px',
          height: '1px',
          position: 'absolute',
          pointerEvents: 'none',
        }}
      >
        {isActive &&
          sparkles.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              style={{
                position: 'absolute',
                left: sparkle.x,
                top: sparkle.y,
                width: sparkle.size,
                height: sparkle.size,
                borderRadius: '50%',
                backgroundColor: sparkle.color,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
              transition={{
                duration: sparkle.duration,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'easeInOut',
              }}
            />
          ))}
      </motion.div>
    </div>
  )
}
export default SparklyMouseTrail
