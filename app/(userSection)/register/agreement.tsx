import { Box } from 'theme-ui'
import { Link } from '../../../components'

const Agreement = ({ action = 'registering' }: { action?: string }) => {
  return (
    <Box>
      By {action} your account, you agree to our{' '}
      <Link href='/TK'>Terms of Use</Link> and acknowledge our{' '}
      <Link href='/TK'>Privacy Policy</Link> and{' '}
      <Link href='/TK'>Cookies Disclosure</Link>.
    </Box>
  )
}

export default Agreement
