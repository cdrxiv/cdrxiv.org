import { Box, Flex } from 'theme-ui'
import Link from './link'
import TextInput from './search'

import Column from './column'
import Row from './row'

const Header = () => {
  return (
    <header>
      <Row columns={[12]} gap={4} sx={{ mt: 3 }}>
        <Column start={1} width={3}>
          <Box>
            <TextInput
              placeholder='Search'
              onChange={() => {}}
              backgroundColor='white'
              arrows={true}
            />
          </Box>
        </Column>
        <Column start={5} width={3}>
          <Flex
            sx={{
              justifyContent: 'space-between',
              height: '100%',
              alignItems: 'center',
            }}
          >
            <Link href=''>Home</Link>
            <Link href=''>Channels</Link>
            <Link href=''>Submit</Link>
          </Flex>
        </Column>
      </Row>
    </header>
  )
}

export default Header
