import { useEffect, useRef, useState, useCallback, memo } from 'react'
import { Box } from 'theme-ui'

interface CursorData {
  id: string
  x: number
  y: number
  duration: number
}

interface CursorProps extends CursorData {
  removeCursor: (id: string) => void
}

const CursorSVG = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    height='32'
    viewBox='0 0 32 32'
    width='32'
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
)

const Cursor = memo<CursorProps>(
  ({ id, x, y, duration, removeCursor }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        removeCursor(id)
      }, duration)
      return () => clearTimeout(timer)
    }, [id, duration, removeCursor])

    return (
      <Box
        sx={{
          position: 'fixed',
          left: x - 16,
          top: y - 16,
          width: '32px',
          height: '32px',
          transformOrigin: 'center',
          animation: `cursorTrail ${duration}ms ease-out forwards`,
          willChange: 'transform, opacity',
          pointerEvents: 'none',
        }}
      >
        <CursorSVG />
      </Box>
    )
  },
  (prevProps, nextProps) => prevProps.id === nextProps.id,
)
Cursor.displayName = 'Cursor'

const MouseTrail = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursors, setCursors] = useState<CursorData[]>([])
  const cursorCounter = useRef(0)
  const animationFrameId = useRef<number | null>(null)
  const MAX_TRAIL_LENGTH = 15

  const handleMouseMove = useCallback((event: MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY })

    if (!animationFrameId.current) {
      animationFrameId.current = requestAnimationFrame(() => {
        const id = `cursor-${cursorCounter.current++}`
        const x = event.clientX
        const y = event.clientY
        const duration = 500

        setCursors((prevCursors) => {
          const newCursors = [...prevCursors, { id, x, y, duration }]
          if (newCursors.length > MAX_TRAIL_LENGTH) {
            newCursors.shift()
          }
          return newCursors
        })

        animationFrameId.current = null
      })
    }
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

  const removeCursor = useCallback((id: string) => {
    setCursors((prevCursors) =>
      prevCursors.filter((cursor) => cursor.id !== id),
    )
  }, [])

  return (
    <>
      <style>{`
        @keyframes cursorTrail {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        * {
          cursor: none !important;
        }
      `}</style>
      <Box
        sx={{
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 9999,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'fixed',
            left: mousePosition.x - 16,
            top: mousePosition.y - 16,
            width: '32px',
            height: '32px',
          }}
        >
          <CursorSVG />
        </Box>
        {cursors.map((cursor) => (
          <Cursor key={cursor.id} {...cursor} removeCursor={removeCursor} />
        ))}
      </Box>
    </>
  )
}

export default MouseTrail
