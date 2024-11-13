import { Box, Flex } from 'theme-ui'
import { Link, Loading } from '../components'

type Props = {
  label: string
  doi?: string
}
const DOIDisplay = ({ label, doi }: Props) => {
  let url = doi
  if (!doi) {
    url = '#'
  } else if (!doi.startsWith('https://doi.org')) {
    url = `https://doi.org/${doi}`
  }

  return (
    <Flex sx={{ gap: 2, alignItems: 'baseline' }}>
      <Box sx={{ variant: 'text.mono' }}>{label}:</Box>
      <Link href={url} forwardArrow={!!doi} sx={{ variant: 'text.mono' }}>
        {doi ? url : <Loading sx={{ display: 'inline' }} />}
      </Link>
    </Flex>
  )
}
export default DOIDisplay
