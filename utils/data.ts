import { Preprint } from '../types/preprint'

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

  const answer = additionalField.answer

  if (typeof answer === 'string') {
    try {
      return JSON.parse(answer)
    } catch (error) {
      return answer
    }
  }

  return answer
}
