import { Box, Flex } from 'theme-ui'

type Props = {
  error?: string | null
  children: React.ReactNode
}
const Form: React.FC<Props> = ({ error, children }) => {
  return (
    <Flex sx={{ flexDirection: 'column', gap: 7 }}>
      {error && <Box sx={{ color: 'red' }}>{error}</Box>}

      {children}
    </Flex>
  )
}

export default Form
