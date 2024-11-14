import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import useTracking from './use-tracking'

export type Errors<T> = Partial<{ [K in keyof T]: string }>
export type Setter<T> = {
  [K in keyof T]: (value: T[K]) => void
}
export type Blur<T> = {
  [K in keyof T]: () => void
}
export type Dirtied<T> = Partial<{ [K in keyof T]: boolean }>

export function useForm<T>(
  initialize: () => T,
  validate: (values: T) => Errors<T>,
  submit: (values: T) => Promise<void>,
  analyticsIdentifier: { [label: string]: number | string },
  setNavigationWarning?: (shouldWarn: boolean) => void,
) {
  const [data, setData] = useState<T>(initialize)
  const keys = useRef(Object.keys(data ?? {}))
  const [errors, setErrors] = useState<Errors<T>>({})
  const [visibleErrors, setVisibleErrors] = useState<Errors<T>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [dirtiedFields, setDirtiedFields] = useState<Dirtied<T>>(
    keys.current.reduce((accum, key) => {
      accum[key as keyof T] = false
      return accum
    }, {} as Dirtied<T>),
  )

  const setDataWrapper = useCallback(
    (value: T | ((prev: T) => T), resetErrors?: boolean) => {
      if (resetErrors) {
        // Set all fields to "clean"
        setDirtiedFields(
          keys.current.reduce((accum, key) => {
            accum[key as keyof T] = false
            return accum
          }, {} as Dirtied<T>),
        )
      } else {
        setNavigationWarning && setNavigationWarning(true)
      }
      return setData(value)
    },
    [setNavigationWarning],
  )
  const setters = useMemo<Setter<T>>(() => {
    return keys.current.reduce((accum, key) => {
      accum[key as keyof T] = (value: T[keyof T]) => {
        setDataWrapper((prev) => ({
          ...prev,
          [key]: value,
        }))
      }
      return accum
    }, {} as Setter<T>)
  }, [setDataWrapper])

  const blurs = useMemo<Blur<T>>(() => {
    return keys.current.reduce((accum, key) => {
      accum[key as keyof T] = () => {
        setDirtiedFields((prev) => ({ ...prev, [key]: true }))
      }
      return accum
    }, {} as Blur<T>)
  }, [])

  const track = useTracking()
  // Turn off navigation warning on unmount
  useEffect(() => {
    return () => setNavigationWarning && setNavigationWarning(false)
  }, [setNavigationWarning])

  useEffect(() => {
    const fullErrors = validate(data)
    const dirtiedErrors = Object.keys(fullErrors).reduce((accum, key) => {
      if (dirtiedFields[key as keyof T]) {
        accum[key as keyof T] = fullErrors[key as keyof T]
      }
      return accum
    }, {} as Errors<T>)

    setErrors(fullErrors)
    setVisibleErrors(dirtiedErrors)
  }, [data, validate, dirtiedFields])

  const handleSubmit = useCallback(() => {
    setDirtiedFields(
      keys.current.reduce((accum, key) => {
        accum[key as keyof T] = true
        return accum
      }, {} as Dirtied<T>),
    )
    setSubmitError(null)

    const valid = Object.keys(errors).length === 0
    if (!valid) {
      track('form_invalid', {
        error: Object.keys(errors).join(', '),
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
  }, [errors, data, submit, analyticsIdentifier, track])

  return {
    data,
    setters,
    blurs,
    setData: setDataWrapper,
    errors: visibleErrors,
    onSubmit: handleSubmit,
    submitError,
  }
}
