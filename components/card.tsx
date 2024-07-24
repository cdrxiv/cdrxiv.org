import React, { useEffect, useState, useRef } from 'react'
import { Box, Flex, useThemeUI } from 'theme-ui'
import Badge from './badge'
import { useRouter } from 'next/navigation'

interface CardProps {
  title: string
  authors: Array<string>
  type: 'article' | 'data'
  date: Date
  href?: string
  onClick?: () => void
}

const cardWidth = 420
const cardHeight = 240
const cornerSize = 40
const borderWidth = 1

const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return date.toLocaleDateString('en-US', options)
}

const Card: React.FC<CardProps> = ({
  title,
  authors,
  type,
  date,
  href,
  onClick,
}) => {
  const { theme } = useThemeUI()
  const router = useRouter()

  const [hovered, setHovered] = useState<boolean>(false)
  const [dimensions, setDimensions] = useState<{
    width: number
    height: number
  }>({
    width: cardWidth,
    height: cardHeight,
  })
  const ref = useRef<HTMLDivElement>(null)

  const badgeColor: string = type === 'article' ? 'articlePink' : 'dataGreen'
  const color: string = hovered ? 'blue' : 'black'

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

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else if (onClick) {
      onClick()
    }
  }
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }

  return (
    <Box
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      role='button'
      aria-label={`${type} titled ${title} by ${authors.join(', ')}, published on ${formatDate(
        date,
      )}`}
      sx={{
        position: 'relative',
        width: '100%',
        height: 'auto',
        cursor: 'pointer',
        outline: 'none', // use highlight style for focus instead
      }}
    >
      <svg
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        stroke={color}
        shapeRendering={'crispEdges'}
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
          p: [3, 3, 7, 7],
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Flex sx={{ flexDirection: 'column' }}>
          <Box
            sx={{
              variant: 'text.body',
              mb: [2, 2, 3, 3],
              color,
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
