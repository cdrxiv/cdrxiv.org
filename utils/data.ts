import { Funder, Preprint } from '../types/preprint'

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

export const getFunders = (preprint: Preprint | null): Funder[] => {
  try {
    const funders = getAdditionalField(preprint, 'Funder(s) and award numbers')
    if (!funders) return []
    if (!Array.isArray(funders)) return []
    return funders.filter(
      (item): item is Funder =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.funder === 'string' &&
        typeof item.award === 'string',
    )
  } catch (error) {
    console.error('Error parsing funders data:', error)
    return []
  }
}
