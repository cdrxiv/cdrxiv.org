import React, { forwardRef, useCallback } from 'react'
import { Box, Input, InputProps, ThemeUIStyleObject } from 'theme-ui'

interface SearchProps extends Omit<InputProps, 'onSubmit'> {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit?: React.FormEventHandler<HTMLFormElement>
  placeholder?: string
  arrows?: boolean
  sx?: ThemeUIStyleObject
  inverted?: boolean
  disabled?: boolean
}

const Search = forwardRef<HTMLInputElement, SearchProps>(
  (
    {
      onChange,
      onSubmit,
      placeholder,
      inverted,
      arrows = true,
      sx = {},
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const handleSubmit = useCallback(
      (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSubmit && onSubmit(e)
      },
      [onSubmit],
    )

    return (
      <Box sx={{ position: 'relative', width: '100%' }}>
        <form onSubmit={handleSubmit}>
          <Input
            ref={ref}
            placeholder={placeholder ?? ''}
            onChange={onChange}
            disabled={disabled}
            sx={{
              variant: 'text.monoCaps',
              ...(inverted
                ? {
                    boxShadow: (
                      theme,
                    ) => `1px 1px 1px 1px ${theme?.colors?.text} inset,
          -1px -1px 1px 1px ${theme?.colors?.muted} inset`,
                    background: 'primary',
                  }
                : {}),
              pr: arrows ? 5 : 3,
              '::placeholder': { color: 'text' },
              ...sx,
            }}
            {...props}
          />
          {arrows && (
            <Box
              as='button'
              sx={{
                position: 'absolute',
                right: 3,
                top: '50%',
                transform: 'translateY(-50%)',
                color: disabled ? 'muted' : 'blue',
                letterSpacing: '0.1em',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                fontSize: 'inherit',
                fontFamily: 'inherit',
              }}
              {...{
                type: 'submit',
                disabled: disabled,
                'aria-label': 'Submit search',
              }}
            >
              &gt;&gt;
            </Box>
          )}
        </form>
      </Box>
    )
  },
)

Search.displayName = 'Search'

export default Search
