import { Box } from 'theme-ui'
import { Link } from '../../../components'

const Agreement = ({ action = 'registering' }: { action?: string }) => {
  return (
    <Box>
      By {action} your account, you agree to our{' '}
      <Link href='/terms-of-use'>Terms of Use</Link> and acknowledge our{' '}
      <Link href='/privacy-policy'>Privacy Policy</Link> and{' '}
      <Link href='/cookies-notice'>Cookies Notice</Link>.
    </Box>
  )
}

export default Agreement
