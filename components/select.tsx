import React from 'react'
import { Box, Select as ThemeUISelect, useThemeUI } from 'theme-ui'

interface SelectProps {
  title: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  children:
    | React.ReactElement<HTMLOptionElement>
    | React.ReactElement<HTMLOptionElement>[]
}

const Select: React.FC<SelectProps> = ({
  title,
  value,
  onChange,
  children,
}) => {
  const { theme } = useThemeUI()
  return (
    <>
      <Box sx={{ variant: 'text.monoCaps', my: 2, fontSize: [1, 1, 1, 2] }}>
        {title}
      </Box>
      <ThemeUISelect
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
          borderColor: 'mediumGray',
          border: 0,
          boxShadow: `1px 1px 0px 1px ${theme?.colors?.bezelGrayDark} inset, -1px -1px 0px 1px ${theme?.colors?.bezelGrayLight} inset`,
          borderRadius: 1,
          background: 'backgroundGray',
          px: 3,
          outline: 'none',
          ':focus': {
            borderColor: 'blue',
          },
        }}
      >
        {children}
      </ThemeUISelect>
    </>
  )
}

export default Select
