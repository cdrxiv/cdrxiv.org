import { Author } from '../types/preprint'

export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return date.toLocaleDateString('en-US', options)
}

export const authorList = (authors: Author[]): string => {
  return authors
    .map(
      (author) =>
        `${author.first_name || ''} ${author.middle_name || ''} ${author.last_name || ''}`,
    )
    .join(', ')
}
