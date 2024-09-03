import { track } from '@vercel/analytics'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePreprint } from '../app/submit/(authed)/preprint-context'

export type Errors<T> = Partial<{ [K in keyof T]: string }>
export type Setter<T> = {
  [K in keyof T]: (value: T[K]) => void
}

export function useForm<T>(
  initialize: () => T,
  validate: (values: T) => Errors<T>,
  submit: (values: T) => Promise<void>,
  setNavigationWarning?: (shouldWarn: boolean) => void,
) {
  const { preprint } = usePreprint()
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
      track('submit_step_not_valid', {
        errors: Object.keys(errors).join(', '),
        preprint_id: preprint.pk,
      })
      return false
    } else {
      return submit(data)
        .then((res) => {
          return true
        })
        .catch((err) => {
          track('submit_step_error', {
            error: err.message,
            preprint_id: preprint.pk,
          })
          setSubmitError(err.message ?? 'Error submitting form.')
          return false
        })
    }
  }, [errors, data, submit, preprint.pk])

  return {
    data,
    setters,
    setData: setDataWrapper,
    errors: showErrors ? errors : empty,
    onSubmit: handleSubmit,
    submitError,
  }
}
