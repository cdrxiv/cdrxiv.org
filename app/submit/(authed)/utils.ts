import { useCallback, useEffect, useMemo, useState } from 'react'
import { Preprint } from '../../../types/preprint'

export const getAdditionalField = (
  preprint: Preprint | null,
  fieldName: string,
) => {
  if (!preprint) {
    return null
  }

  const additionalField = preprint.additional_field_answers.find(
    (field) => field.field?.name === fieldName,
  )

  if (!additionalField) {
    return null
  }

  return additionalField.answer
}

export const createAdditionalField = (fieldName: string, value: string) => {
  return {
    answer: value,
    field: {
      name: fieldName,
    },
  }
}

type Errors<T> = Partial<{ [K in keyof T]: string }>
export function useForm<T>(
  initialize: () => T,
  validate: (values: T) => Errors<T>,
  submit: (values: T) => Promise<void>,
) {
  const [data, setData] = useState<T>(initialize)
  const [errors, setErrors] = useState<Errors<T>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showErrors, setShowErrors] = useState<boolean>(false)
  const empty: Errors<T> = useMemo(() => ({}), [])

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
      return submit(data).then(
        (res) => {
          return true
        },
        (err) => {
          setSubmitError(err.message ?? 'Error submitting form.')
          return false
        },
      )
    }
  }, [errors, data, submit])

  return {
    data,
    setData,
    errors: showErrors ? errors : empty,
    onSubmit: handleSubmit,
    submitError,
  }
}
