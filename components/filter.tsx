import React from 'react'
import { Box, ThemeUIStyleObject } from 'theme-ui'

interface FilterOption {
  value: string | null
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

const Filter: React.FC<FilterProps> = ({
  options,
  selectedValue,
  onChange,
  title,
  showAll = false,
  sx = {},
}) => {
  const allOptions = showAll
    ? [{ value: null, label: 'All' }, ...options]
    : options

  const handleTagClick = (value: string | null) => {
    onChange(value === selectedValue ? null : value)
  }

  return (
    <Box>
      {title && (
        <Box sx={{ variant: 'text.monoCaps', fontSize: [1, 1, 1, 2], mt: 2 }}>
          {title}
        </Box>
      )}
      <Box>
        {allOptions.map((option) => (
          <Box
            key={option.value ?? 'all'}
            as='button'
            onClick={() => handleTagClick(option.value)}
            sx={{
              variant: 'text.body',
              cursor: 'pointer',
              backgroundColor: 'transparent',
              border: 'solid 0px',
              borderColor: 'blue',
              borderBottomWidth: selectedValue === option.value ? '3px' : '1px',
              userSelect: 'none',
              mr: 2,
              p: 1,
              pb: 0,
              color: 'blue',
              ':focus-visible': {
                boxShadow:
                  'inset 0 3px 0 -2px blue, inset -3px 0 0 -2px blue, inset 3px 0 0 -2px blue',
                outline: 'none',
              },
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
