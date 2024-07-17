import React from 'react'
import { Box, Flex, useThemeUI } from 'theme-ui'
import Badge from './badge'

interface CardProps {
  title: string
  authors: Array<string>
  type: 'article' | 'data'
  date: Date
}

const foldSize = 40
const borderWidth = 1

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
  const color = type === 'article' ? 'articlePink' : 'dataGreen'
  return (
    <Box
      sx={{
        position: 'relative',
        border: '1px solid',
        borderColor: 'black',
        p: 4,
        width: 420,
        height: 240,
        backgroundColor: 'white',
      }}
    >
      <Flex
        sx={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: `-${borderWidth}px`,
            right: `-${borderWidth}px`,
            border: `${borderWidth}px solid`,
            borderColor: 'black',
            height: foldSize,
            width: foldSize,
            backgroundColor: 'white',
            borderRightColor: 'white',
            borderTopColor: 'white',
          }}
        />
        <svg
          width={foldSize}
          height={foldSize}
          viewBox={`0 0 ${foldSize} ${foldSize}`}
          style={{
            position: 'absolute',
            top: `-${borderWidth}px`,
            right: `-${borderWidth}px`,
            pointerEvents: 'none',
          }}
        >
          <line
            x1='0'
            y1='0'
            x2={foldSize}
            y2={foldSize}
            stroke={(theme?.colors?.black as string) ?? 'black'}
            strokeWidth={borderWidth}
          />
        </svg>

        <Flex sx={{ flexDirection: 'column' }}>
          <Box sx={{ variant: 'text.body', mb: 2 }}>{title}</Box>
          <Box sx={{ variant: 'text.mono' }}>{authors.join(', ')}</Box>
        </Flex>

        <Flex sx={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Badge color={color}>{type}</Badge>
          <Box sx={{ variant: 'text.monoCaps', fontSize: [1, 1, 1, 2] }}>
            {formatDate(date)}
          </Box>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Card
