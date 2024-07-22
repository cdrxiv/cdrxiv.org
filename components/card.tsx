import React, { useEffect, useState } from 'react'
import { Box, Flex, useThemeUI } from 'theme-ui'
import Badge from './badge'

interface CardProps {
  title: string
  authors: Array<string>
  type: 'article' | 'data'
  date: Date
}

const cardWidth = 420
const cardHeight = 240
const cornerSize = 40
const borderWidth = 2

const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return date.toLocaleDateString('en-US', options)
}

const Card: React.FC<CardProps> = ({ title, authors, type, date }) => {
  const { theme } = useThemeUI()
  const badgeColor = type === 'article' ? 'articlePink' : 'dataGreen'
  const [hovered, setHovered] = React.useState(false)
  const [dimensions, setDimensions] = useState({
    width: cardWidth,
    height: cardHeight,
  })

  const ref = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        const width = ref.current.offsetWidth
        const height = ref.current.offsetHeight
        setDimensions({ width, height })
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <Box
      ref={ref}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      sx={{
        position: 'relative',
        width: ['100%', `${cardWidth}px`],
        height: ['auto', `${cardHeight}px`],
        cursor: 'pointer',
      }}
    >
      <svg
        width='100%'
        height='100%'
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        stroke={
          hovered
            ? (theme?.colors?.blue as string)
            : (theme?.colors?.black as string)
        }
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <path
          d={`M ${borderWidth} ${borderWidth} H ${
            dimensions.width - cornerSize
          } L ${dimensions.width - borderWidth} ${cornerSize} V ${
            dimensions.height - borderWidth
          } H ${borderWidth} Z`}
          fill={theme?.colors?.white as string}
          strokeWidth={borderWidth}
        />
        <path
          d={`M ${dimensions.width - cornerSize} ${borderWidth} L ${
            dimensions.width - borderWidth
          } ${cornerSize} M ${
            dimensions.width - cornerSize
          } ${borderWidth} V ${cornerSize} H ${dimensions.width - borderWidth}`}
          fill={hovered ? (theme?.colors?.backgroundGray as string) : 'none'}
          strokeWidth={borderWidth}
        />
      </svg>
      <Flex
        sx={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          p: 4,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Flex sx={{ flexDirection: 'column' }}>
          <Box
            sx={{
              variant: 'text.body',
              mb: 2,
              color: hovered ? 'blue' : 'black',
            }}
          >
            {title}
          </Box>
          <Box sx={{ variant: 'text.mono' }}>{authors.join(', ')}</Box>
        </Flex>

        <Flex
          sx={{
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            mt: 3,
          }}
        >
          <Badge color={badgeColor}>{type}</Badge>
          <Box sx={{ variant: 'text.monoCaps', fontSize: [1, 1, 1, 2] }}>
            {formatDate(date)}
          </Box>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Card
