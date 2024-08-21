import { Funder, Preprint } from '../types/preprint'

export const getAdditionalField = (
  preprint: Preprint | null,
  fieldName: string,
): string | null => {
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

export const getFunders = (preprint: Preprint | null): Funder[] | null => {
  try {
    const rawData = getAdditionalField(preprint, 'Funder(s) and award numbers')
    if (!rawData) return null
    let parsedData
    try {
      parsedData = JSON.parse(rawData)
    } catch {
      return null
    }
    if (!Array.isArray(parsedData)) return null
    return parsedData
      .filter(
        (item): item is Funder =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.funder === 'string',
      )
      .map(({ funder, award }) => ({ funder, award: award || '' }))
  } catch (error) {
    console.error('Error in getFunders:', error)
    return null
  }
}
