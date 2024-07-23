import React from 'react'
import { Box, Select } from 'theme-ui'

interface DropdownProps {
  title: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  children:
    | React.ReactElement<HTMLOptionElement>
    | React.ReactElement<HTMLOptionElement>[]
}

const Dropdown: React.FC<DropdownProps> = ({
  title,
  value,
  onChange,
  children,
}) => {
  return (
    <>
      <Box sx={{ variant: 'text.monoCaps', my: 2, fontSize: [1, 1, 1, 2] }}>
        {title}
      </Box>
      <Select
        value={value}
        onChange={onChange}
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
          outline: 'none',
          ':focus': {
            borderColor: 'blue',
          },
        }}
      >
        {children}
      </Select>
    </>
  )
}

export default Dropdown
