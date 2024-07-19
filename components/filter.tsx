import React from 'react'
import { Box, ThemeUIStyleObject } from 'theme-ui'

interface FilterOption {
  value: string
  label: string
}

interface FilterProps {
  options: FilterOption[]
  selectedValue: string | null
  onChange: (selectedValue: string | null) => void
  title?: string
  showAll?: boolean
  sx?: ThemeUIStyleObject
}

const shared: { [key: string]: ThemeUIStyleObject } = {
  tag: {
    variant: 'text.body',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'solid 0px',
    borderBottomWidth: '1px',
    borderColor: 'blue',
    userSelect: 'none',
    mr: 2,
    p: 0,
    color: 'blue',
  },
}

const Filter: React.FC<FilterProps> = ({
  options,
  selectedValue,
  onChange,
  title,
  showAll = false,
  sx = {},
}) => {
  const handleTagClick = (value: string) => {
    onChange(value === selectedValue ? null : value)
  }

  const handleAllClick = () => {
    onChange(null)
  }

  return (
    <Box>
      {title && (
        <Box sx={{ variant: 'text.monoCaps', fontSize: [1, 1, 1, 2], mt: 2 }}>
          {title}
        </Box>
      )}
      <Box>
        {showAll && (
          <Box
            as='button'
            onClick={handleAllClick}
            sx={{
              ...shared.tag,
              borderBottomWidth: selectedValue === null ? '3px' : '1px',
              ...sx,
            }}
          >
            All
          </Box>
        )}
        {options.map((option) => (
          <Box
            key={option.value}
            as='button'
            onClick={() => handleTagClick(option.value)}
            sx={{
              ...shared.tag,
              borderBottomWidth: selectedValue === option.value ? '3px' : '1px',
              ...sx,
            }}
          >
            {option.label}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default Filter
