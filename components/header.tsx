import { Flex } from 'theme-ui'
import Link from './link'
import Search from './search'
import Column from './column'
import Row from './row'

const margin = 12

const Header = () => {
  return (
    <header>
      <Row
        columns={[12]}
        gap={4}
        sx={{
          position: 'fixed',
          width: 'calc(100% - 2 * 13px)',
          height: '100px',
          top: margin + 1,
          left: margin + 1,
          px: 52,
          alignContent: 'center',
          backgroundColor: 'backgroundGray',
          zIndex: 2,
        }}
      >
        <Column start={1} width={3}>
          <Search placeholder='Search' onChange={() => {}} arrows={true} />
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
            <Link href='/submit'>Submit</Link>
          </Flex>
        </Column>
      </Row>
    </header>
  )
}

export default Header
