import React, {
  forwardRef,
  useCallback,
  useState,
  useEffect,
  useRef,
  useMemo,
  useImperativeHandle,
} from 'react'
import { Box, Input, InputProps, ThemeUIStyleObject } from 'theme-ui'

interface SearchProps extends Omit<InputProps, 'onSubmit'> {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => Promise<boolean>
  placeholder?: string
  arrows?: boolean
  sx?: ThemeUIStyleObject
  inverted?: boolean
  showLoadingState?: boolean
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
      showLoadingState = false,
      ...props
    },
    ref,
  ) => {
    const [isLoading, setIsLoading] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [dotCount, setDotCount] = useState(0)
    const internalRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => internalRef.current as HTMLInputElement)

    useEffect(() => {
      if (!isLoading) return
      const interval = setInterval(() => {
        setDotCount((prevCount) => (prevCount + 1) % 4)
      }, 250)
      return () => clearInterval(interval)
    }, [isLoading, showLoadingState])

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setInputValue(newValue)
        onChange && onChange(e)
      },
      [onChange],
    )

    const handleSubmit = useCallback(
      async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (onSubmit) {
          setIsLoading(true)
          onSubmit(e)
            .then((success) => {
              if (success) {
                setInputValue('')
              }
              setIsLoading(false)
            })
            .catch(() => {
              setIsLoading(false)
            })
        }
      },
      [onSubmit],
    )

    const displayValue = useMemo(() => {
      return isLoading && showLoadingState
        ? `Searching${''.padEnd(dotCount, '.')}`
        : inputValue
    }, [isLoading, showLoadingState, dotCount, inputValue])

    useEffect(() => {
      // setting value directly in <Input> didn't work
      if (internalRef.current) {
        internalRef.current.value = displayValue
      }
    }, [displayValue])

    return (
      <Box sx={{ position: 'relative', width: '100%' }}>
        <form onSubmit={handleSubmit}>
          <Input
            ref={internalRef}
            placeholder={placeholder ?? ''}
            onChange={handleChange}
            disabled={isLoading && showLoadingState}
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
          {arrows && !isLoading && (
            <Box
              sx={{
                position: 'absolute',
                right: 3,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'blue',
                letterSpacing: '0.1em',
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
