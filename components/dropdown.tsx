import React from 'react'
import { Box, Select } from 'theme-ui'

interface DropdownProps {
  title: string
  options: string[]
  selectedOption: string
  handleOptionChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

const Dropdown: React.FC<DropdownProps> = ({
  title,
  options,
  selectedOption,
  handleOptionChange,
}) => {
  return (
    <Box sx={{ mx: 2 }}>
      <Box sx={{ variant: 'text.monoCaps', my: 2, fontSize: [1, 1, 1, 2] }}>
        {title}
      </Box>
      <Select
        value={selectedOption}
        onChange={handleOptionChange}
        arrow={
          <Box
            sx={{
              variant: 'text.body',
              color: 'blue',
              ml: -28,
              alignSelf: 'center',
              pointerEvents: 'none',
            }}
          >
            {'>'}
          </Box>
        }
        sx={{
          variant: 'text.body',
          border: '2px solid',
          borderColor: 'mediumGray',
          borderRadius: 0,
          background: 'backgroundGray',
          px: 3,
        }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </Box>
  )
}

export default Dropdown
