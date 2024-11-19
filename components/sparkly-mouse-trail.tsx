import { useEffect, useRef, useState, useCallback, memo } from 'react'
import { Box } from 'theme-ui'

interface SparkleData {
  id: string
  x: number
  y: number
  size: number
  duration: number
}

interface SparkleProps extends SparkleData {
  removeSparkle: (id: string) => void
}

const Sparkle = memo<SparkleProps>(
  ({ id, x, y, size, duration, removeSparkle }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        removeSparkle(id)
      }, duration)
      return () => clearTimeout(timer)
    }, [id, duration, removeSparkle])

    return (
      <Box
        sx={{
          position: 'fixed',
          pointerEvents: 'none',
          '--start-x': `${x}px`,
          '--start-y': `${y}px`,
          '--end-x': `${x}px`,
          '--end-y': `${y + 100}px`,
          '--initial-scale': size,
          animation: `sparkle ${duration / 1000}s ease-out forwards`,
          fontSize: `${size * 16}px`,
          userSelect: 'none',
          willChange: 'transform, opacity',
        }}
      >
        +
      </Box>
    )
  },
  (prevProps, nextProps) => prevProps.id === nextProps.id,
)
Sparkle.displayName = 'Sparkle'

const SparklyMouseTrail = () => {
  const [sparkles, setSparkles] = useState<SparkleData[]>([])
  const mousePosition = useRef({ x: 0, y: 0 })
  const sparkleCounter = useRef(0)
  const animationFrameId = useRef<number | null>(null)
  const MAX_SPARKLES = 100

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!animationFrameId.current) {
      animationFrameId.current = requestAnimationFrame(() => {
        const id = `sparkle-${sparkleCounter.current++}`
        const size = Math.random() * 0.5 + 0.5
        const duration = Math.random() * 1500 + 1500
        const offsetX = (Math.random() - 0.5) * 100
        const offsetY = Math.random() * 50
        const x = event.clientX + offsetX
        const y = event.clientY + offsetY

        setSparkles((prevSparkles) => {
          const newSparkles = [...prevSparkles, { id, x, y, size, duration }]
          if (newSparkles.length > MAX_SPARKLES) {
            newSparkles.shift()
          }
          return newSparkles
        })

        animationFrameId.current = null
      })
    }
    mousePosition.current = { x: event.clientX, y: event.clientY }
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [handleMouseMove])

  const removeSparkle = useCallback((id: string) => {
    setSparkles((prevSparkles) => prevSparkles.filter((s) => s.id !== id))
  }, [])

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
        '@keyframes sparkle': {
          '0%': {
            transform:
              'translate(var(--start-x), var(--start-y)) scale(var(--initial-scale))',
            opacity: 1,
          },
          '100%': {
            transform: 'translate(var(--end-x), var(--end-y)) scale(0)',
            opacity: 0,
          },
        },
      }}
    >
      {sparkles.map((sparkle) => (
        <Sparkle key={sparkle.id} {...sparkle} removeSparkle={removeSparkle} />
      ))}
    </Box>
  )
}

export default SparklyMouseTrail
