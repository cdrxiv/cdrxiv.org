import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigation } from '../navigation-context'

export const createAdditionalField = (fieldName: string, value: string) => {
  return {
    answer: value,
    field: {
      name: fieldName,
    },
  }
}

type Errors<T> = Partial<{ [K in keyof T]: string }>
type Setter<T> = {
  [K in keyof T]: (value: T[K]) => void
}

export function useForm<T>(
  initialize: () => T,
  validate: (values: T) => Errors<T>,
  submit: (values: T) => Promise<void>,
) {
  const [data, setData] = useState<T>(initialize)
  const { setNavigationWarning } = useNavigation()
  const setDataWrapper = useCallback(
    (value: T | ((prev: T) => T), internal?: boolean) => {
      if (internal) {
        setShowErrors(false)
      } else {
        setNavigationWarning(true)
      }
      return setData(value)
    },
    [setNavigationWarning],
  )
  const keys = useRef(Object.keys(data ?? {}))
  const setters = useMemo<Setter<T>>(() => {
    return keys.current.reduce((accum, key) => {
      accum[key as keyof T] = (value: T[keyof T]) =>
        setDataWrapper((prev) => ({
          ...prev,
          [key]: value,
        }))
      return accum
    }, {} as Setter<T>)
  }, [setDataWrapper])

  const [errors, setErrors] = useState<Errors<T>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showErrors, setShowErrors] = useState<boolean>(false)
  const empty: Errors<T> = useMemo(() => ({}), [])

  // Turn off navigation warning on unmount
  useEffect(() => {
    return () => setNavigationWarning(false)
  }, [setNavigationWarning])

  useEffect(() => {
    setErrors(validate(data))
  }, [data, validate])

  const handleSubmit = useCallback(() => {
    setShowErrors(true)
    setSubmitError(null)

    const valid = Object.keys(errors).length === 0
    if (!valid) {
      return false
    } else {
      return submit(data)
        .then((res) => {
          return true
        })
        .catch((err) => {
          setSubmitError(err.message ?? 'Error submitting form.')
          return false
        })
    }
  }, [errors, data, submit])

  return {
    data,
    setters,
    setData: setDataWrapper,
    errors: showErrors ? errors : empty,
    onSubmit: handleSubmit,
    submitError,
  }
}

export function getFormattedDate() {
  const now = new Date()

  // Get the ISO string (in UTC)
  const isoString = now.toISOString() // e.g., "2024-08-13T19:35:22.478Z"

  // Remove the 'Z' at the end (which indicates UTC)
  const baseString = isoString.slice(0, -1)

  // Get timezone offset in ±HH:MM format
  const timezoneOffset = -now.getTimezoneOffset()
  const offsetHours = String(
    Math.floor(Math.abs(timezoneOffset) / 60),
  ).padStart(2, '0')
  const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0')
  const offsetSign = timezoneOffset >= 0 ? '+' : '-'
  const timezone = `${offsetSign}${offsetHours}:${offsetMinutes}`

  // Combine the base ISO string with the timezone
  return `${baseString}${timezone}`
}
