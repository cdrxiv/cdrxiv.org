import { Box, Flex, Label } from 'theme-ui'

interface Props {
  label?: React.ReactNode
  id?: string
  children?: React.ReactNode
  description?: React.ReactNode
  error?: React.ReactNode
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
        {error && label && <Box sx={{ color: 'red' }}>&nbsp;(!)</Box>}{' '}
      </Label>
      {children}
      {description && <Box sx={{ variant: 'text.mono' }}>{description}</Box>}
      {error && <Box sx={{ variant: 'styles.error' }}>{error}</Box>}
    </Flex>
  )
}

export default Field
