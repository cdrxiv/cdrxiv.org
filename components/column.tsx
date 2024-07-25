import React from 'react'
import { Box, BoxProps } from 'theme-ui'
import type { Theme } from 'theme-ui'

type ArrayInput = number | string | (number | string)[]

interface ColumnProps extends BoxProps {
  start?: ArrayInput
  width?: ArrayInput
  dl?: 0.5 | 1
  dr?: 0.5 | 1
  children?: React.ReactNode
}

const Column: React.FC<ColumnProps> = ({
  start,
  width,
  dl,
  dr,
  children,
  sx,
  ...props
}) => {
  start = start || 'auto'
  width = width || 'auto'

  const makeArray = (input: ArrayInput): (number | string)[] => {
    if (input && !Array.isArray(input)) {
      input = [input]
    }

    if (!Array.isArray(input) || ![1, 2, 4].includes(input.length)) {
      throw new Error('Array length must be 1, 2, or 4')
    }

    if (input.length === 1) {
      return [input[0], input[0], input[0], input[0]]
    } else if (input.length === 2) {
      return [input[0], input[0], input[1], input[1]]
    }

    return input
  }

  const startArray = makeArray(start)
  const widthArray = makeArray(width)

  const end = startArray.map((d, i) => {
    if (d === 'auto') return 'auto'
    return (d as number) + (widthArray[i] as number)
  })

  let ml: (number | string)[] | undefined
  let mr: (number | string)[] | undefined

  if (dl) {
    if (![0.5, 1].includes(dl)) {
      throw new Error('dl must be 0.5 or 1')
    }
    ml = dl === 0.5 ? ['-10px', '-12px', '-12px', '-20px'] : [-5, -6, -6, -8]
  }

  if (dr) {
    if (![0.5, 1].includes(dr)) {
      throw new Error('dr must be 0.5 or 1')
    }
    mr = dr === 0.5 ? ['-10px', '-12px', '-12px', '-20px'] : [-5, -6, -6, -8]
  }

  return (
    <Box
      {...props}
      sx={{
        gridColumnStart: startArray,
        gridColumnEnd: end,
        ml,
        mr,
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

export default Column
