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
        <Box sx={{ variant: 'text.monoCaps', fontSize: [1, 1, 1, 2] }}>
          {label}
        </Box>
      </Label>
      {children}
      {description && <Box sx={{ variant: 'text.mono' }}>{description}</Box>}
    </Flex>
  )
}

export default Field
