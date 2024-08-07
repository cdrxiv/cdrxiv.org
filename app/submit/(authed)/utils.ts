import { useCallback, useState } from 'react'
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

type Errors<T> = Partial<{ [K in keyof T]: string }>
export function useForm<T>(
  initialize: () => T,
  validate: (values: T) => Errors<T>,
) {
  const [data, setData] = useState<T>(initialize)
  const [errors, setErrors] = useState<Errors<T>>({})

  const handleValidate = useCallback(() => {
    const updatedErrors = validate(data)
    setErrors(updatedErrors)

    return Object.keys(updatedErrors).length === 0
  }, [data, validate])

  return {
    data,
    setData,
    errors,
    onSubmit: handleValidate,
  }
}
