import { PREPRINT_BASE } from '../actions/constants'
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

export const createAdditionalField = (fieldName: string, value: string) => {
  return {
    answer: value,
    field: {
      name: fieldName,
    },
  }
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
  const domain =
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
      ? 'https://cdrxiv.org'
      : 'https://staging.cdrxiv.org'
  return {
    upload_type: 'dataset',
    title: preprint.title as string,
    description: preprint.abstract as string,
    doi: preprint.doi ?? undefined,
    communities: [{ identifier: 'cdrxiv' }],
    license: getAdditionalField(preprint, 'Data license') as string,
    keywords: preprint.keywords.map((keyword) => keyword.word),
    subjects: preprint.subject.map((s) => ({
      term: s.name,
      identifier: `${domain}/?subject=${s.name}`,
    })),
    creators: getZenodoCreators(preprint.authors),
    related_identifiers: [
      {
        relation: 'isPartOf',
        identifier: `${domain}/preprint/${preprint.pk}`,
      },
    ],
  }
}

const DATA_LICENSE_DISPLAY = {
  'cc-by-nc-4.0': {
    url: 'https://creativecommons.org/licenses/by-nc/4.0/',
    name: 'CC BY-NC 4.0',
  },
  'cc-by-4.0': {
    url: 'https://creativecommons.org/licenses/by/4.0/',
    name: 'CC BY 4.0',
  },
}
export const getZenodoLicense = (preprint: Preprint) => {
  const dataLicense = getAdditionalField(preprint, 'Data license')
    // Handle accidental capitalization (can occur in repository manager dashboard)
    ?.toLowerCase()
  if (!dataLicense || !['cc-by-4.0', 'cc-by-nc-4.0'].includes(dataLicense)) {
    return null
  }

  return DATA_LICENSE_DISPLAY[dataLicense as 'cc-by-4.0' | 'cc-by-nc-4.0']
}

// Instead of relying on Janeway's license URLs, we override them here. This is because
// some of the license URLs have gone stale (e.g., https://creativecommons.org/licenses/authors).
const ARTICLE_LICENSE_DISPLAY: Record<string, { name: string; url: string }> = {
  1: { url: 'https://creativecommons.org/licenses/by/4.0/', name: 'CC BY 4.0' },
  4: {
    url: 'https://creativecommons.org/licenses/by-nc/4.0/',
    name: 'CC BY-NC 4.0',
  },
  6: { name: 'All Rights Reserved', url: '' },
}

export const getArticleLicense = (licensePk?: number) => {
  const lookup = String(licensePk)

  if (!ARTICLE_LICENSE_DISPLAY[lookup]) {
    return null
  }

  return {
    url: ARTICLE_LICENSE_DISPLAY[lookup].url,
    name: ARTICLE_LICENSE_DISPLAY[lookup].name,
  }
}

const { repository, ...CHECKABLE_FIELDS } = PREPRINT_BASE
type BaseKey = keyof typeof CHECKABLE_FIELDS

export const isPreprintEmpty = (preprint: Preprint) => {
  return Object.keys(CHECKABLE_FIELDS).every((key) => {
    const value = preprint[key as BaseKey]
    const baseValue = PREPRINT_BASE[key as BaseKey]
    if (value === baseValue) {
      return true
    } else if (Array.isArray(value) || typeof value === 'object') {
      return JSON.stringify(value) === JSON.stringify(baseValue)
    } else if (Array.isArray(baseValue) && baseValue.length === 0 && !value) {
      // handle inconsistent empty array representations
      return true
    }

    return false
  })
}

export const isValidOrcid = (orcid: string, allowLowercase?: boolean) => {
  const orcidRegex = new RegExp(
    '^\\d{4}-\\d{4}-\\d{4}-\\d{3}(\\d|X)$',
    allowLowercase ? 'i' : undefined,
  )
  return orcidRegex.test(orcid)
}
