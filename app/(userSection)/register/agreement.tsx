import { Box, CheckboxProps, Label } from 'theme-ui'
import { Checkbox, Link } from '../../../components'

interface Props extends CheckboxProps {
  action?: string
}
const Agreement: React.FC<Props> = ({ action = 'registering', ...props }) => {
  return (
    <>
      <Label sx={{ variant: 'text.body', textTransform: 'none' }}>
        <Checkbox {...props} />
        <Box>
          By {action} your account, you agree to our{' '}
          <Link href='/terms-of-use'>Terms of Use</Link> and acknowledge our{' '}
          <Link href='/privacy-policy'>Privacy Policy</Link> and{' '}
          <Link href='/cookies-notice'>Cookies Notice</Link>.
        </Box>
      </Label>
    </>
  )
}

export default Agreement
