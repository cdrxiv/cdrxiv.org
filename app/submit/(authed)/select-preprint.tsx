import { Card, Field, Form, Row } from '../../../components'
import { Preprint, Preprints } from '../../../types/preprint'
import { submissionTypes } from '../../../utils/formatters'

type Props = {
  preprints: Preprints
  setPreprint: (preprint: Preprint) => void
}
const SelectPreprint: React.FC<Props> = ({ preprints, setPreprint }) => {
  return (
    <>
      <Form>
        <Field label='Resume submission' id='incomplete'>
          <Row columns={1} gap={[5, 6, 6, 8]} sx={{ gridAutoRows: '1fr' }}>
            {preprints.map((preprint) => (
              <Card
                key={preprint.pk}
                title={preprint.title}
                authors={preprint.authors}
                badges={submissionTypes(preprint)}
                date={null}
                onClick={() => setPreprint(preprint)}
                background='primary'
              />
            ))}
          </Row>
        </Field>
      </Form>
    </>
  )
}

export default SelectPreprint
