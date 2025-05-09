import React, { useCallback, useEffect, useState } from 'react'
import { Box, Input, InputProps } from 'theme-ui'
import { formatKeyword } from '../utils/formatters'

export interface Props extends InputProps {
  validate?: (keyword: string) => boolean
  values?: string[]
  setValues?: (keywords: string[]) => void
}

const KeywordInput: React.FC<Props> = ({
  sx,
  validate,
  onChange,
  values: valuesProp,
  setValues: setValuesProp,
  ...props
}) => {
  const [inputValue, setInputValue] = useState<string>('')
  const [focused, setFocused] = useState<boolean>(false)
  const [values, setValues] = useState<string[]>(valuesProp ?? [])

  // Keep component state up-to-date with controlled value
  useEffect(() => {
    if (valuesProp) {
      setValues(valuesProp)
    }
  }, [valuesProp])

  const handleValuesChange = useCallback(
    (updatedValues: string[]) => {
      setValues(updatedValues)
      setValuesProp && setValuesProp(updatedValues)
    },
    [setValuesProp],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const normalized = inputValue.trim().toLowerCase()
      if (e.key === 'Enter' && normalized !== '') {
        const invalidated = validate && !validate(normalized)
        const duplicate = values.find(
          (v) => v.toLowerCase() === normalized.toLowerCase(),
        )
        if (duplicate || invalidated) {
          // do nothing
          return
        } else {
          handleValuesChange([...values, normalized])
          setInputValue('')
        }
      } else if (e.key === 'Backspace' && inputValue === '') {
        handleValuesChange(values.slice(0, -1))
        setInputValue('')
      }
    },
    [inputValue, values, validate, handleValuesChange],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange && onChange(e)
      setInputValue(e.target.value)
    },
    [onChange],
  )

  return (
    <Box
      sx={{
        variant: 'forms.input',
        display: 'flex',
        alignItems: 'baseline',
        flexWrap: 'wrap',
        gap: 2,
        minHeight: 36,
        maxHeight: 100,
        overflowY: 'auto',
        borderColor: focused ? 'blue' : 'transparent',
        py: 2,
        ...sx,
      }}
    >
      {values.map((v) => (
        <Box
          as='button'
          key={v}
          onClick={() =>
            handleValuesChange(values.filter((value) => value !== v))
          }
          onKeyDown={(e) => {
            if (e.key === 'Backspace') {
              handleValuesChange(values.filter((value) => value !== v))
            }
          }}
          sx={{
            variant: 'styles.a',
            fontFamily: 'mono',
            fontWeight: 'mono',
            fontSize: [0, 0, 0, 1],
            lineHeight: '130%',
          }}
        >
          {formatKeyword(v)}
        </Box>
      ))}
      <Input
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        value={inputValue}
        placeholder=' ' // Hack to fix Safari baseline alignment issue for empty inputs
        sx={{
          border: 'none',
          boxShadow: 'none',
          background: 'none',
          flexGrow: 1,
          fontFamily: 'mono',
          fontWeight: 'mono',
          fontSize: [0, 0, 0, 1],
          p: 0,
          width: `${inputValue.length}ch`,
        }}
        {...props}
      />
    </Box>
  )
}

export default KeywordInput
