import React, { useState, SVGProps } from 'react'
import { Box, Flex, BoxProps } from 'theme-ui'
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

const borderWidth = 1

const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return date.toLocaleDateString('en-US', options)
}

type ElBoxProps = BoxProps & SVGProps<SVGGElement> & { as: string }
const ElBox: React.FC<ElBoxProps> = (props) => <Box {...props} />

type SVGBoxProps = BoxProps & SVGProps<SVGSVGElement>
const SVGBox: React.FC<SVGBoxProps> = (props) => <Box as='svg' {...props} />

interface CornerProps {
  size: number
  coverage?: number
  hovered: boolean
  sx: { display: string[] }
}
const Corner: React.FC<CornerProps> = ({
  size = 40,
  coverage = 2,
  hovered,
  sx,
}) => {
  return (
    <SVGBox
      as='svg'
      viewBox={`0 0 ${size + coverage} ${size + coverage}`}
      sx={{
        width: `${size + coverage}px`,
        height: 'auto',
        position: 'absolute',
        top: `-${coverage}px`,
        right: `-${coverage}px`,
        overflow: 'visible',
        stroke: hovered ? 'blue' : 'black',
        strokeWidth: borderWidth,
        ...sx,
      }}
    >
      <ElBox
        as='rect'
        width={size + coverage}
        height={size + coverage}
        stroke='none'
        sx={{
          fill: 'backgroundGray',
        }}
      />
      <ElBox
        as='polygon'
        points={`0,${coverage} 0,${size + coverage} ${size},${size + coverage}`}
        sx={{
          fill: hovered ? 'mediumGray' : 'white',
        }}
      />
    </SVGBox>
  )
}

const Card: React.FC<CardProps> = ({
  title,
  authors,
  type,
  date,
  href,
  onClick,
}) => {
  const router = useRouter()

  const [hovered, setHovered] = useState<boolean>(false)

  const badgeColor: string = type === 'article' ? 'articlePink' : 'dataGreen'
  const color: string = hovered ? 'blue' : 'text'

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
        background: 'white',
        borderColor: color,
        borderWidth,
        borderStyle: 'solid',
        outline: 'none', // use highlight style for focus instead
      }}
    >
      <Corner
        hovered={hovered}
        size={40}
        sx={{ display: ['none', 'none', 'inherit', 'inherit'] }}
      />
      <Corner
        hovered={hovered}
        size={30}
        sx={{ display: ['inherit', 'inherit', 'none', 'none'] }}
      />

      <Flex
        sx={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          p: [3, 6, 6, 7],
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Flex sx={{ flexDirection: 'column' }}>
          <Box
            sx={{
              variant: 'text.body',
              mb: [3, 3, 3, 4],
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
          <Box
            sx={{
              variant: 'text.monoCaps',
              alignSelf: 'center',
            }}
          >
            {formatDate(date)}
          </Box>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Card
