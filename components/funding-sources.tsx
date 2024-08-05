import { Flex, Input } from 'theme-ui'
import Column from './column'
import Row from './row'
import React, { useCallback, useState } from 'react'
import StyledLink from './link'

interface FundingEntry {
  funder: string
  award: string
  _key: number
}

const FundingSources = ({}) => {
  const [entries, setEntries] = useState<FundingEntry[]>([
    { funder: '', award: '', _key: 0 },
  ])

  const addEntry = useCallback(() => {
    setEntries((prev) => [
      ...prev,
      { _key: prev[prev.length - 1]._key + 1, funder: '', award: '' },
    ])
  }, [])

  return (
    <>
      <Row columns={[6, 6, 8, 8]}>
        <Column start={1} width={[6, 6, 7, 7]}>
          <Row columns={6}>
            <Column
              start={1}
              width={[3, 3, 3, 3]}
              sx={{ variant: 'text.mono' }}
            >
              Funder
            </Column>
            <Column
              start={[3, 3, 4, 4]}
              width={[3, 3, 3, 3]}
              sx={{ variant: 'text.mono' }}
            >
              Award Number
            </Column>
          </Row>
        </Column>
      </Row>

      {entries.map(({ funder, award, _key }) => (
        <Row columns={[6, 6, 8, 8]} key={_key}>
          <Column start={1} width={[6, 6, 7, 7]}>
            <Row columns={6}>
              <Column start={1} width={[6, 6, 3, 3]}>
                <Input />
              </Column>
              <Column start={[1, 1, 4, 4]} width={[6, 6, 3, 3]}>
                <Input />
              </Column>
            </Row>
          </Column>
          <Column start={[1, 1, 8, 8]} width={1}>
            <Flex sx={{ height: '100%', alignItems: 'center' }}>
              <StyledLink
                onClick={() =>
                  setEntries((prev) => prev.filter((el) => el._key !== _key))
                }
                sx={{
                  variant: 'text.monoCaps',
                  textDecoration: 'none',
                  ml: -3,
                }}
              >
                (x)
              </StyledLink>
            </Flex>
          </Column>
        </Row>
      ))}

      <StyledLink onClick={addEntry} sx={{ variant: 'text.mono' }}>
        + Add Funding Source
      </StyledLink>
    </>
  )
}

export default FundingSources
