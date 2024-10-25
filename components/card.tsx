import React, { useState, SVGProps } from 'react'
import { Box, Flex, BoxProps, ThemeUIStyleObject } from 'theme-ui'
import Link from 'next/link'

import Badge from './badge'
import type { Author } from '../types/preprint'
import { formatDate, authorList } from '../utils/formatters'
import AuthorsList from './authors-list'

interface CardProps {
  title: string
  authors: Author[]
  badges: { label: string; color: string }[]
  date: Date | null
  href?: string
  onClick?: () => void
  sx?: ThemeUIStyleObject
  background?: 'background' | 'primary'
}

const borderWidth = 1

type ElBoxProps = BoxProps & SVGProps<SVGGElement> & { as: string }
const ElBox: React.FC<ElBoxProps> = (props) => <Box {...props} />

type SVGBoxProps = BoxProps & SVGProps<SVGSVGElement>
const SVGBox: React.FC<SVGBoxProps> = (props) => <Box as='svg' {...props} />

interface CornerProps {
  size: number
  coverage?: number
  hovered: boolean
  sx: { display: string[] }
  background: 'background' | 'primary'
}
const Corner: React.FC<CornerProps> = ({
  size = 40,
  coverage = 2,
  hovered,
  sx,
  background,
}) => {
  return (
    <SVGBox
      viewBox={`0 0 ${size + coverage} ${size + coverage}`}
      sx={{
        width: `${size + coverage}px`,
        height: 'auto',
        position: 'absolute',
        top: `-${coverage}px`,
        right: `-${coverage}px`,
        overflow: 'visible',
        fill: 'none',
        stroke: hovered ? 'blue' : 'text',
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
          fill: background,
        }}
      />
      <ElBox
        as='polygon'
        points={`0,${coverage} 0,${size + coverage} ${size},${size + coverage}`}
        sx={{
          fill: hovered ? 'muted' : 'primary',
        }}
      />
    </SVGBox>
  )
}

const Card: React.FC<CardProps> = ({
  title,
  authors,
  badges,
  date,
  href,
  onClick,
  background = 'background',
  sx = {},
}) => {
  const [hovered, setHovered] = useState<boolean>(false)

  const color = hovered ? 'blue' : 'text'

  const handleClick = () => {
    if (onClick) {
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
    <Link href={href || '#'} key={href} passHref legacyBehavior>
      <Box
        sx={{
          textDecoration: 'none',
          color: 'inherit',
          height: '100%',
          minHeight: ['178px', '202px', '202px', '202px'],
        }}
      >
        <Flex
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          tabIndex={0}
          role='button'
          aria-label={`${title} by ${authorList(authors)}, published on ${date ? formatDate(date) : 'unknown date'}`}
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            cursor: 'pointer',
            background: 'primary',
            borderColor: color,
            borderWidth,
            borderStyle: 'solid',
            outline: 'none', // use highlight style for focus instead
            ...sx,
          }}
        >
          <Corner
            hovered={hovered}
            background={background}
            size={40}
            sx={{ display: ['none', 'none', 'inherit', 'inherit'] }}
          />
          <Corner
            hovered={hovered}
            background={background}
            size={30}
            sx={{ display: ['inherit', 'inherit', 'none', 'none'] }}
          />

          <Flex
            sx={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1,
              p: [3, 6, 6, 7],
              position: 'relative',
            }}
          >
            <Flex sx={{ flexDirection: 'column' }}>
              <Box
                sx={{
                  variant: 'styles.h3',
                  mb: [3, 3, 3, 4],
                  pr: [36, 36, 48, 48],
                  color,
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {title}
              </Box>
              <Box sx={{ variant: 'text.mono' }}>
                <AuthorsList authors={authors} />
              </Box>
            </Flex>
            <Flex
              sx={{
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                mt: 3,
              }}
            >
              <Flex sx={{ gap: 2 }}>
                {badges.map((badge) => (
                  <Badge key={badge.label} color={badge.color}>
                    {badge.label}
                  </Badge>
                ))}
                {badges.length === 0 && (
                  <Box
                    sx={{ variant: 'text.monoCaps', color: 'listBorderGrey' }}
                  >
                    Not labeled
                  </Box>
                )}
              </Flex>
              {date && (
                <Box
                  sx={{
                    variant: 'text.monoCaps',
                    alignSelf: 'center',
                  }}
                >
                  {formatDate(date, { month: 'short' })}
                </Box>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Link>
  )
}

export default Card
