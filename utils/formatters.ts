import type { Author } from '../types/preprint'

export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return date.toLocaleDateString('en-US', options)
}

export const authorList = (
  authors: Author[],
  abbreviate: boolean = false,
): string => {
  if (authors.length === 0) {
    return ''
  }

  if (abbreviate && authors.length > 1) {
    const firstAuthor = authors[0]
    return `${firstAuthor.last_name || ''} et al.`
  }

  return authors
    .map((author) =>
      `${author.first_name || ''} ${author.middle_name || ''} ${author.last_name || ''}`.trim(),
    )
    .join(', ')
}
