import { Column, Row, Select } from '../../../../components'
import { getArticleLicense } from '../../../../utils/data'

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
    <option value={'1'}>{getArticleLicense(1)?.name}</option>
    <option value={'4'}>{getArticleLicense(4)?.name}</option>
    <option value={'6'}>{getArticleLicense(6)?.name}</option>
  </Select>
)

const DataLicense = ({
  dataLicense,
  setDataLicense,
}: {
  dataLicense: string
  setDataLicense: (value: string) => void
  setLicense?: (value: number) => void
}) => (
  <Select
    value={dataLicense}
    onChange={(e) => {
      setDataLicense(e.target.value)
    }}
    id='license'
  >
    <option value={''}>Select one</option>
    <option value={'cc-by-4.0'}>CC BY 4.0</option>
    <option value={'cc-by-nc-4.0'}>CC BY-NC 4.0</option>
    <option value={'cc-by-sa-4.0'}>CC BY-SA 4.0</option>
    <option value={'cc-by-nc-sa-4.0'}>CC BY-NC-SA 4.0</option>
  </Select>
)

const Licenses: React.FC<Props> = ({
  license,
  setLicense,
  dataLicense,
  setDataLicense,
  submissionType,
}) => {
  if (submissionType === 'Article' || !submissionType) {
    return <ArticleLicense license={license} setLicense={setLicense} />
  } else if (submissionType === 'Data') {
    return (
      <DataLicense
        dataLicense={dataLicense}
        setDataLicense={(value: string) => {
          // Set preprint license to All Rights Reserved (not used in practice)
          setLicense(6)
          setDataLicense(value)
        }}
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
