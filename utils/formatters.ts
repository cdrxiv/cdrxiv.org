import type { Author, Preprint } from '../types/preprint'
import { getAdditionalField } from './data'

export const formatDate = (
  date: Date,
  dateOptions?: Intl.DateTimeFormatOptions,
): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: dateOptions?.year ?? 'numeric',
    month: dateOptions?.month ?? 'long',
    day: dateOptions?.day ?? 'numeric',
  }
  return date.toLocaleDateString('en-US', options)
}

type Options =
  | {
      abbreviate?: boolean
      array?: false
    }
  | {
      array: true
      abbreviate?: false
    }

export function authorList(
  authors: Author[],
  options?: { abbreviate?: boolean; array?: false },
): string
export function authorList(
  authors: Author[],
  options: { abbreviate?: false; array: true },
): string[]
export function authorList(
  authors: Author[],
  { abbreviate, array }: Options = {},
) {
  if (authors.length === 0) {
    return ''
  }

  if (abbreviate && authors.length > 1) {
    const firstAuthor = authors[0]
    return `${firstAuthor.last_name || ''} et al.`
  }

  const authorsArray = authors.map((author) =>
    [author.first_name, author.middle_name, author.last_name]
      .filter(Boolean)
      .join(' ')
      .trim(),
  )

  return array ? authorsArray : authorsArray.join(', ')
}

export const submissionTypes = (
  preprint: Preprint,
): { label: string; color: string }[] => {
  const type = getAdditionalField(preprint, 'Submission type')

  return [
    { label: 'Article', color: 'pink' },
    { label: 'Data', color: 'green' },
  ].filter((badge) =>
    [badge.label, 'Both'].find((el) => type?.match(new RegExp(el, 'i'))),
  )
}

export const decodeFilename = (filename: string) => {
  return decodeURIComponent(
    filename
      .split('')
      .map((char) => {
        // For characters with code > 127, encode them using encodeURIComponent
        if (char.charCodeAt(0) > 127) {
          return encodeURIComponent(char)
        }
        return char
      })
      .join(''),
  )
}
