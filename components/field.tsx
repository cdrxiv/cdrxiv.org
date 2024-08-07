import { Box, Flex, Label } from 'theme-ui'

interface Props {
  label: string
  id: string
  children: React.ReactNode
  description?: string
  error?: string
}
const Field: React.FC<Props> = ({
  label,
  id,
  children,
  description,
  error,
}) => {
  return (
    <Flex sx={{ flexDirection: 'column', gap: 2 }}>
      <Label htmlFor={id}>
        {label}
        {error && <Box sx={{ color: 'red' }}>&nbsp;(!)</Box>}{' '}
      </Label>
      {children}
      {description && <Box sx={{ variant: 'text.mono' }}>{description}</Box>}
      {error && <Box sx={{ variant: 'text.mono', color: 'red' }}>{error}</Box>}
    </Flex>
  )
}

export default Field
