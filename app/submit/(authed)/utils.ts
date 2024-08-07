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
  submit: (values: T) => Promise<boolean>,
) {
  const [data, setData] = useState<T>(initialize)
  const [errors, setErrors] = useState<Errors<T>>({})
  const [showErrors, setShowErrors] = useState<boolean>(false)
  const empty: Errors<T> = useMemo(() => ({}), [])

  useEffect(() => {
    setErrors(validate(data))
  }, [data, validate])

  const handleSubmit = useCallback(() => {
    setShowErrors(true)

    const valid = Object.keys(errors).length === 0
    if (!valid) {
      return false
    } else {
      return submit(data)
    }
  }, [errors, data, submit])

  return {
    data,
    setData,
    errors: showErrors ? errors : empty,
    onSubmit: handleSubmit,
  }
}
