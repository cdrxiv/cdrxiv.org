import { Flex, Input } from 'theme-ui'
import React, { useCallback, useEffect, useState } from 'react'
import Column from './column'
import Row from './row'
import StyledLink from './link'

interface FundingEntry {
  funder: string
  award: string
  _key: number
}

export interface Props {
  value?: string
  setValue?: (value: string) => void
}

const initialize = (value?: string): FundingEntry[] => {
  if (value) {
    try {
      const array = JSON.parse(value)
      if (
        array.length > 0 &&
        array.every(
          (el: any) =>
            typeof el?.funder === 'string' && typeof el?.award === 'string',
        )
      ) {
        return array.map(
          (el: { funder: string; award: string }, i: number) => ({
            funder: el.funder,
            award: el.award,
            _key: i,
          }),
        )
      } else {
        console.warn('Unexpected funding value:', value)
      }
    } catch {
      console.warn('Unexpected funding value:', value)
    }
  }
  return [{ funder: '', award: '', _key: 0 }]
}

const FundingSources: React.FC<Props> = ({ value, setValue }) => {
  const [entries, setEntries] = useState<FundingEntry[]>(() =>
    initialize(value),
  )

  const addEntry = useCallback(() => {
    setEntries((prev) => [
      ...prev,
      { _key: prev[prev.length - 1]._key + 1, funder: '', award: '' },
    ])
  }, [])

  useEffect(() => {
    if (setValue) {
      setValue(
        JSON.stringify(entries.map(({ funder, award }) => ({ funder, award }))),
      )
    }
  }, [setValue, entries])

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
                <Input
                  value={funder}
                  onChange={(e) =>
                    setEntries((prev) =>
                      prev.map((el) =>
                        el._key === _key
                          ? { ...el, funder: e.target.value }
                          : el,
                      ),
                    )
                  }
                />
              </Column>
              <Column start={[1, 1, 4, 4]} width={[6, 6, 3, 3]}>
                <Input
                  value={award}
                  onChange={(e) =>
                    setEntries((prev) =>
                      prev.map((el) =>
                        el._key === _key
                          ? { ...el, award: e.target.value }
                          : el,
                      ),
                    )
                  }
                />
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
