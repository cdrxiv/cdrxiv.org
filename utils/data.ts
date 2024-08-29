import { Author, Funder, Preprint } from '../types/preprint'
import { Creator, Deposition } from '../types/zenodo'

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

const getZenodoCreators = (authors: Author[]): Creator[] => {
  return authors.map((author) => ({
    name: `${author.last_name}, ${author.first_name}${author.middle_name ? ` ${author.middle_name}` : ''}`,
    affiliation: author.institution ?? undefined,
    orcid: author.orcid ?? undefined,
  }))
}

export const getZenodoMetadata = (
  preprint: Preprint,
): Deposition['metadata'] => {
  return {
    upload_type: 'dataset',
    title: preprint.title,
    description: preprint.abstract,
    doi: preprint.doi ?? undefined,
    communities: [{ identifier: 'cdrxiv' }],
    keywords: preprint.keywords.map((keyword) => keyword.word),
    subjects: preprint.subject.map((s) => ({
      term: s.name,
      identifier: `https://cdrxiv.org/?subject=${s.name}`,
    })),
    creators: getZenodoCreators(preprint.authors),
    related_identifiers: [
      {
        relation: 'isPartOf',
        identifier: `https://cdrxiv.org/preprint/${preprint.pk}`,
      },
    ],
  }
}
