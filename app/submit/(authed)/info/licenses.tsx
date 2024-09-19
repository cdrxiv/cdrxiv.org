import { Column, Row, Select } from '../../../../components'

type Props = {
  license: number
  setLicense: (value: number) => void
  submissionType: string
  dataLicense: string
  setDataLicense: (value: string) => void
}

const EntryLabel = ({
  label,
  mobile,
}: {
  label?: 'Article' | 'Data'
  mobile?: boolean
}) => {
  const display = mobile
    ? ['inherit', 'inherit', 'none', 'none']
    : ['none', 'none', 'inherit', 'inherit']
  return (
    <>
      {(!mobile || label === 'Article') && (
        <Column
          start={1}
          width={[5, 5, 3, 3]}
          sx={{
            variant: 'text.mono',
            display,
          }}
        >
          Article
        </Column>
      )}
      {(!mobile || label === 'Data') && (
        <Column
          start={[1, 1, 4, 4]}
          width={[5, 5, 3, 3]}
          sx={{
            variant: 'text.mono',
            display,
          }}
        >
          Data
        </Column>
      )}
    </>
  )
}

const ZENODO_TO_JANEWAY = {
  'cc-by-4.0': '1',
  'cc-by-nc-4.0': '4',
}

const ArticleLicense = ({
  license,
  setLicense,
}: {
  license: number
  setLicense: (value: number) => void
}) => (
  <Select
    value={String(license)}
    onChange={(e) => setLicense(Number(e.target.value))}
    id='license'
  >
    <option value={'0'}>Select one</option>
    <option value={'1'}>CC BY 4.0</option>
    <option value={'4'}>CC BY-NC 4.0</option>
    <option value={'6'}>All Rights Reserved</option>
  </Select>
)

const DataLicense = ({
  dataLicense,
  setDataLicense,
  setLicense,
}: {
  dataLicense: string
  setDataLicense: (value: string) => void
  setLicense?: (value: number) => void
}) => (
  <Select
    value={dataLicense}
    onChange={(e) => {
      setDataLicense(e.target.value)
      if (e.target.value && setLicense) {
        setLicense(
          Number(
            ZENODO_TO_JANEWAY[e.target.value as 'cc-by-4.0' | 'cc-by-nc-4.0'],
          ),
        )
      }
    }}
    id='license'
  >
    <option value={''}>Select one</option>
    <option value={'cc-by-4.0'}>CC BY 4.0</option>
    <option value={'cc-by-nc-4.0'}>CC BY-NC 4.0</option>
  </Select>
)

const Licenses: React.FC<Props> = ({
  license,
  setLicense,
  dataLicense,
  setDataLicense,
  submissionType,
}) => {
  if (submissionType === 'Article') {
    return <ArticleLicense license={license} setLicense={setLicense} />
  } else if (submissionType === 'Data') {
    return (
      <DataLicense
        dataLicense={dataLicense}
        setDataLicense={setDataLicense}
        setLicense={setLicense}
      />
    )
  }

  return (
    <>
      <Row columns={[6, 6, 8, 8]}>
        <Column start={1} width={[6, 6, 7, 7]}>
          <Row columns={6}>
            <EntryLabel />
          </Row>
        </Column>
      </Row>

      <Row columns={[6, 6, 8, 8]}>
        <Column start={1} width={[6, 6, 7, 7]}>
          <Row columns={6}>
            <EntryLabel mobile label='Article' />
            <Column start={1} width={[6, 6, 3, 3]} sx={{ mb: [4, 4, 0, 0] }}>
              <ArticleLicense license={license} setLicense={setLicense} />
            </Column>

            <EntryLabel mobile label='Data' />
            <Column start={[1, 1, 4, 4]} width={[6, 6, 3, 3]}>
              <DataLicense
                dataLicense={dataLicense}
                setDataLicense={setDataLicense}
              />
            </Column>
          </Row>
        </Column>
      </Row>
    </>
  )
}

export default Licenses
