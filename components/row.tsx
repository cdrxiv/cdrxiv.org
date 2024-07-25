import React from 'react'
import { Grid, GridProps, ThemeUIStyleObject } from 'theme-ui'

type ArrayInput = number | number[]

interface RowProps extends GridProps {
  columns?: ArrayInput
  gap?: ArrayInput
  children?: React.ReactNode
  sx?: ThemeUIStyleObject
}

const Row: React.FC<RowProps> = ({
  children,
  columns,
  gap,
  sx = {},
  ...props
}) => {
  const makeArray = (input: ArrayInput): number[] => {
    if (!Array.isArray(input)) {
      return [input, input, input, input]
    }
    if (![1, 2, 4].includes(input.length)) {
      throw new Error('Array length must be 1, 2, or 4')
    }
    if (input.length === 1) {
      return [input[0], input[0], input[0], input[0]]
    }
    if (input.length === 2) {
      return [input[0], input[0], input[1], input[1]]
    }
    return input
  }

  let columnGap: number[]
  let rowGap: number[]

  if (typeof gap === 'number' || Array.isArray(gap)) {
    const processedGap = makeArray(gap)
    columnGap = processedGap
    rowGap = processedGap
  } else {
    columnGap = [5, 6, 6, 8]
    rowGap = [0, 0, 0, 0]
  }

  const processedColumns =
    typeof columns === 'number' || Array.isArray(columns)
      ? makeArray(columns)
      : [6, 8, 12, 12]

  return (
    <Grid
      {...props}
      columns={processedColumns}
      sx={{
        columnGap,
        rowGap,
        ...sx,
      }}
    >
      {children}
    </Grid>
  )
}

export default Row
