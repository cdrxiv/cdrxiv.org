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

  return additionalField.answer
}

export const getFunders = (preprint: Preprint | null): Funder[] => {
  try {
    const rawData = getAdditionalField(preprint, 'Funder(s) and award numbers')
    if (!rawData) return []
    const parsedData = JSON.parse(rawData)
    if (!Array.isArray(parsedData)) return []
    return parsedData.filter(
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
