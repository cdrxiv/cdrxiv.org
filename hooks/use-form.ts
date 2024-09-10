import { track } from '@vercel/analytics'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Preprint } from '../types/preprint'

export type Errors<T> = Partial<{ [K in keyof T]: string }>
export type Setter<T> = {
  [K in keyof T]: (value: T[K]) => void
}

export function useForm<T>(
  initialize: () => T,
  validate: (values: T) => Errors<T>,
  submit: (values: T) => Promise<void>,
  analyticsIdentifier: { [label: string]: number | string },
  setNavigationWarning?: (shouldWarn: boolean) => void,
) {
  const [data, setData] = useState<T>(initialize)
  const setDataWrapper = useCallback(
    (value: T | ((prev: T) => T), internal?: boolean) => {
      if (internal) {
        setShowErrors(false)
      } else {
        setNavigationWarning && setNavigationWarning(true)
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
    return () => setNavigationWarning && setNavigationWarning(false)
  }, [setNavigationWarning])

  useEffect(() => {
    setErrors(validate(data))
  }, [data, validate])

  const handleSubmit = useCallback(() => {
    setShowErrors(true)
    setSubmitError(null)

    const valid = Object.keys(errors).length === 0
    if (!valid) {
      track('form_invalid', {
        errors: Object.keys(errors).join(', '),
        ...analyticsIdentifier,
      })
      return false
    } else {
      return submit(data)
        .then((res) => {
          return true
        })
        .catch((err) => {
          track('form_error', {
            error: err.message,
            ...analyticsIdentifier,
          })
          setSubmitError(err.message ?? 'Error submitting form.')
          return false
        })
    }
  }, [errors, data, submit, analyticsIdentifier])

  return {
    data,
    setters,
    setData: setDataWrapper,
    errors: showErrors ? errors : empty,
    onSubmit: handleSubmit,
    submitError,
  }
}
