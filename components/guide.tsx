import React, { useState, useEffect } from 'react'
import { Box } from 'theme-ui'

import Row from './row'
import Column from './column'

type GuideStyle = 'border' | 'solid'
type Columns = [number, number, number, number]

interface GuideProps {
  style?: GuideStyle
  columns?: Columns
  color?: string
  opacity?: number
}
interface GuideColumnsProps {
  count: number
  columns: Columns
  style: GuideStyle
  color: string
  opacity: number
}

const Guide: React.FC<GuideProps> = ({
  style = 'solid',
  color = 'highlight',
  columns = [6, 8, 12, 12],
  opacity = 0.1,
}) => {
  const [display, setDisplay] = useState(false)

  useEffect(() => {
    function handler(event: KeyboardEvent) {
      const { key, metaKey } = event
      if (key === ';' && metaKey) {
        setDisplay((prev) => !prev)
      }
    }

    document.addEventListener('keydown', handler)
    return () => {
      document.removeEventListener('keydown', handler)
    }
  }, [])

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        right: 0,
        top: 0,
        zIndex: 5000,
        pointerEvents: 'none',
        display: display ? 'initial' : 'none',
      }}
    >
      {columns.map((count, index) => (
        <Box
          key={index}
          sx={{
            display: Array(4)
              .fill(null)
              .map((d, i) => (i === index ? 'initial' : 'none')),
          }}
        >
          <GuideColumns
            count={count}
            style={style}
            columns={columns}
            color={color}
            opacity={opacity}
          />
        </Box>
      ))}
    </Box>
  )
}

const GuideColumns: React.FC<GuideColumnsProps> = ({
  count,
  columns,
  style,
  color,
  opacity,
}) => {
  return (
    <Row columns={columns}>
      {Array(count)
        .fill(null)
        .map((d, i) => {
          return (
            <Column
              key={i}
              start={[i + 1]}
              width={[1]}
              sx={{
                height: '100vh',
                bg: style === 'solid' ? color : 'transparent',
                opacity: style == 'solid' ? opacity : 1,
                borderStyle: 'solid',
                borderWidth: '0px',
                borderLeftWidth: style === 'solid' ? '0px' : '1px',
                borderRightWidth: style === 'solid' ? '0px' : '1px',
              }}
            />
          )
        })}
    </Row>
  )
}

export default Guide
