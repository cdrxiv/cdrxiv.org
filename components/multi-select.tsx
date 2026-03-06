import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Box, Label } from 'theme-ui'
import Checkbox from './checkbox'

export interface Option {
  value: string
  label: string
}

export interface Props {
  options: Option[]
  values?: string[]
  setValues?: (values: string[]) => void
  placeholder?: string
  sx?: object
}

const MultiSelect: React.FC<Props> = ({
  options,
  values: valuesProp,
  setValues: setValuesProp,
  placeholder,
  sx,
}) => {
  const [values, setValues] = useState<string[]>(valuesProp ?? [])
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownId = useRef(
    `multiselect-${Math.random().toString(36).slice(2)}`,
  )

  useEffect(() => {
    if (valuesProp) {
      setValues(valuesProp)
    }
  }, [valuesProp])

  const handleValuesChange = useCallback(
    (updated: string[]) => {
      setValues(updated)
      setValuesProp?.(updated)
    },
    [setValuesProp],
  )

  const toggleOption = useCallback(
    (value: string) => {
      if (values.includes(value)) {
        handleValuesChange(values.filter((v) => v !== value))
      } else {
        handleValuesChange([...values, value])
      }
    },
    [values, handleValuesChange],
  )

  const removeValue = useCallback(
    (value: string) => {
      handleValuesChange(values.filter((v) => v !== value))
    },
    [values, handleValuesChange],
  )

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  return (
    <Box ref={containerRef} sx={{ position: 'relative', ...sx }}>
      <Box
        tabIndex={0}
        aria-expanded={open}
        aria-haspopup='true'
        aria-controls={dropdownId.current}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen((o) => !o)
          } else if (e.key === 'Escape') {
            setOpen(false)
          }
        }}
        sx={{
          variant: 'forms.input',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          cursor: 'pointer',
          minHeight: 36,
          pr: 28,
          py: 2,
          ':focus-visible': { borderColor: 'blue' },
        }}
      >
        {values.length === 0 && placeholder && (
          <Box sx={{ color: 'secondary', variant: 'text.mono' }}>
            {placeholder}
          </Box>
        )}
        {values.map((v) => {
          const option = options.find((o) => o.value === v)
          return (
            <Box
              as='button'
              key={v}
              aria-label={`Remove ${option?.label ?? v}`}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation()
                removeValue(v)
              }}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Backspace' || e.key === 'Delete') {
                  e.stopPropagation()
                  removeValue(v)
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
              {option?.label ?? v}
            </Box>
          )
        })}
        <Box
          sx={{
            variant: 'text.body',
            color: 'blue',
            position: 'absolute',
            right: 19,
            top: 18,
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}
        >
          {'>'}
        </Box>
      </Box>

      {open && (
        <Box
          id={dropdownId.current}
          role='group'
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false)
          }}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 100,
            bg: 'background',
            border: '1px solid',
            borderColor: 'blue',
            mt: '2px',
          }}
        >
          {options.map((option) => (
            <Label
              key={option.value}
              sx={{
                px: 2,
                py: 2,
                cursor: 'pointer',
                variant: 'text.mono',
                textTransform: 'none',
                '&:hover': { bg: 'muted' },
              }}
            >
              <Checkbox
                checked={values.includes(option.value)}
                onChange={() => toggleOption(option.value)}
              />
              {option.label}
            </Label>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default MultiSelect
