'use client'

import { Flex } from 'theme-ui'
import { Card, Field, Row } from '../../../components'
import { Preprints } from '../../../types/preprint'
import { submissionTypes } from '../../../utils/formatters'

type Props = {
  published: Preprints
  review: Preprints
  rejected: Preprints
}
const PreprintsList: React.FC<Props> = ({ published, review, rejected }) => {
  return (
    <>
      <Flex sx={{ flexDirection: 'column', gap: 7 }}>
        <Field label='Published' id='published'>
          <Row columns={1} gap={[5, 6, 6, 8]} sx={{ gridAutoRows: '1fr' }}>
            {published.map((preprint) => (
              <Card
                key={preprint.pk}
                title={preprint.title}
                authors={preprint.authors}
                badges={submissionTypes(preprint)}
                date={
                  preprint.date_published
                    ? new Date(preprint.date_published)
                    : null
                }
                background='primary'
              />
            ))}
          </Row>
        </Field>

        <Field label='Under review' id='review'>
          <Row columns={1} gap={[5, 6, 6, 8]} sx={{ gridAutoRows: '1fr' }}>
            {review.map((preprint) => (
              <Card
                key={preprint.pk}
                title={preprint.title}
                authors={preprint.authors}
                badges={submissionTypes(preprint)}
                date={null}
                background='primary'
              />
            ))}
          </Row>
        </Field>

        <Field label='Rejected' id='rejected'>
          <Row columns={1} gap={[5, 6, 6, 8]} sx={{ gridAutoRows: '1fr' }}>
            {rejected.map((preprint) => (
              <Card
                key={preprint.pk}
                title={preprint.title}
                authors={preprint.authors}
                badges={submissionTypes(preprint)}
                date={null}
                background='primary'
              />
            ))}
          </Row>
        </Field>
      </Flex>
    </>
  )
}

export default PreprintsList
