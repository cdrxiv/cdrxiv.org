import React, { useState, useEffect } from 'react'
import { Box } from 'theme-ui'

import Row from './row'
import Column from './column'

type GuideColor = 'border' | 'solid'

interface GuideProps {
  style?: GuideColor
}
interface GuideColumnsProps {
  indices: number[]
  style: GuideColor
  color?: 'highlight' | 'dataGreen'
}

const Guide: React.FC<GuideProps> = ({ style = 'solid' }) => {
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
        mx: ['26px', '26px', '64px', '64px'],
      }}
    >
      <Box sx={{ display: ['none', 'none', 'initial', 'initial'] }}>
        <GuideColumns
          indices={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
          style={style}
        />
      </Box>
      <Box sx={{ display: ['none', 'initial', 'none', 'none'] }}>
        <GuideColumns indices={[1, 2, 3, 4, 5, 6, 7, 8]} style={style} />
      </Box>
      <Box sx={{ display: ['initial', 'none', 'none', 'none'] }}>
        <GuideColumns indices={[1, 2, 3, 4, 5, 6]} style={style} />
      </Box>
    </Box>
  )
}

const GuideColumns: React.FC<GuideColumnsProps> = ({
  indices,
  style,
  color = 'highlight',
}) => {
  return (
    <Row>
      {indices.map((i) => {
        return (
          <Column
            key={i}
            start={[i]}
            width={[1]}
            sx={{
              height: '100vh',
              bg: style === 'solid' ? color : 'transparent',
              opacity: style == 'solid' ? 0.2 : 1,
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
