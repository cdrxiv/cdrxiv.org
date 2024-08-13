import { Flex, Input } from 'theme-ui'
import React, { useCallback, useEffect, useState } from 'react'
import Column from '../../../../components/column'
import Row from '../../../../components/row'
import StyledLink from '../../../../components/link'

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
      if (array.length > 0) {
        if (
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
      }
    } catch {
      console.warn('Unexpected funding value:', value)
    }
  }
  return [{ funder: '', award: '', _key: 0 }]
}

const EntryLabel = ({
  label,
  mobile,
}: {
  label?: 'funder' | 'award'
  mobile?: boolean
}) => {
  const display = mobile
    ? ['inherit', 'inherit', 'none', 'none']
    : ['none', 'none', 'inherit', 'inherit']
  return (
    <>
      {(!mobile || label === 'funder') && (
        <Column
          start={1}
          width={[5, 5, 3, 3]}
          sx={{
            variant: 'text.mono',
            display,
          }}
        >
          Funder
        </Column>
      )}
      {(!mobile || label === 'award') && (
        <Column
          start={[1, 1, 4, 4]}
          width={[5, 5, 3, 3]}
          sx={{
            variant: 'text.mono',
            display,
          }}
        >
          Award Number
        </Column>
      )}
    </>
  )
}

const FundingSources: React.FC<Props> = ({ value, setValue }) => {
  const [entries, setEntries] = useState<FundingEntry[]>(() =>
    initialize(value),
  )

  const addEntry = useCallback(() => {
    setEntries((prev) => [
      ...prev,
      {
        _key: prev.length ? prev[prev.length - 1]._key + 1 : 0,
        funder: '',
        award: '',
      },
    ])
  }, [])

  useEffect(() => {
    if (setValue) {
      const updatedValue = JSON.stringify(
        entries
          .filter((el) => el.funder || el.award)
          .map(({ funder, award }) => ({ funder, award })),
      )
      if (updatedValue !== value) {
        setValue(updatedValue)
      }
    }
  }, [setValue, entries, value])

  return (
    <>
      <Row columns={[6, 6, 8, 8]} sx={{}}>
        <Column start={1} width={[6, 6, 7, 7]}>
          <Row columns={6}>
            <EntryLabel />
          </Row>
        </Column>
      </Row>
      {entries.map(({ funder, award, _key }, i) => (
        <Row
          columns={[6, 6, 8, 8]}
          key={_key}
          sx={{
            position: 'relative',
            overflow: 'visible',
            borderWidth: 0,
            borderStyle: 'solid',
            borderColor: 'listBorderGrey',
            borderTopWidth: i === 0 ? 0 : ['1px', '1px', 0, 0],
            pt: i === 0 ? 0 : [4, 4, 0, 0],
            mt: i === 0 ? 0 : [3, 3, 0, 0],
          }}
        >
          <Column start={1} width={[6, 6, 7, 7]}>
            <Row columns={6}>
              <EntryLabel mobile label='funder' />
              <Column
                start={[6, 6, 8, 8]}
                width={1}
                sx={{ display: ['initial', 'initial', 'none', 'none'] }}
              >
                <Flex
                  sx={{
                    width: '100%',
                    justifyContent: 'flex-end',
                    mt: -1,
                  }}
                >
                  <StyledLink
                    onClick={() =>
                      setEntries((prev) =>
                        prev.filter((el) => el._key !== _key),
                      )
                    }
                    sx={{ variant: 'text.monoCaps', textDecoration: 'none' }}
                  >
                    (x)
                  </StyledLink>
                </Flex>
              </Column>

              <Column start={1} width={[6, 6, 3, 3]} sx={{ mb: [4, 4, 0, 0] }}>
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

              <EntryLabel mobile label='award' />
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
          <Column
            start={[1, 1, 8, 8]}
            width={1}
            sx={{ display: ['none', 'none', 'initial', 'initial'] }}
          >
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
