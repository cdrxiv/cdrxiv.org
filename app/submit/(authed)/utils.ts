import { useNavigation } from '../navigation-context'
import { useForm as useFormBase, Errors } from '../../../hooks/use-form'
import { usePreprint } from './preprint-context'

export const createAdditionalField = (fieldName: string, value: string) => {
  return {
    answer: value,
    field: {
      name: fieldName,
    },
  }
}

export function useForm<T>(
  initialize: () => T,
  validate: (values: T) => Errors<T>,
  submit: (values: T) => Promise<void>,
) {
  const { setNavigationWarning } = useNavigation()
  const { preprint } = usePreprint()
  return useFormBase(
    initialize,
    validate,
    submit,
    { preprint: preprint.pk },
    setNavigationWarning,
  )
}

export function getFormattedDate() {
  const now = new Date()

  // Get the ISO string (in UTC)
  const isoString = now.toISOString() // e.g., "2024-08-13T19:35:22.478Z"

  // Remove the 'Z' at the end (which indicates UTC)
  const baseString = isoString.slice(0, -1)

  // Get timezone offset in ±HH:MM format
  const timezoneOffset = -now.getTimezoneOffset()
  const offsetHours = String(
    Math.floor(Math.abs(timezoneOffset) / 60),
  ).padStart(2, '0')
  const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0')
  const offsetSign = timezoneOffset >= 0 ? '+' : '-'
  const timezone = `${offsetSign}${offsetHours}:${offsetMinutes}`

  // Combine the base ISO string with the timezone
  return `${baseString}${timezone}`
}
