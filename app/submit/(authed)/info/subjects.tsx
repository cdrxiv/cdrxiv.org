'use client'

import { Box, Flex, Label } from 'theme-ui'
import { Checkbox } from '../../../../components'
import { useSubjects } from '../../../subjects-context'
import { Subject } from '../../../../types/preprint'

const SubjectsBucket: React.FC<{
  description: string
  onChange: (value: string[]) => void
  value: string[]
  bucket: Subject[]
}> = ({ description, value, bucket, onChange }) => {
  return (
    <>
      <Box sx={{ variant: 'text.mono' }}>{description}</Box>
      <Flex sx={{ flexDirection: 'column' }} role='group'>
        {bucket.map(({ name }) => (
          <Label key={name}>
            <Checkbox
              checked={value.includes(name)}
              onChange={(e) =>
                e.target.checked
                  ? onChange([...value, name])
                  : onChange(value.filter((el) => el !== name))
              }
              sx={{ mt: '-1px' }}
            />
            {name}
          </Label>
        ))}
      </Flex>
    </>
  )
}

const Subjects: React.FC<{
  value: string[]
  onChange: (value: string[]) => void
}> = ({ value, onChange }) => {
  const { buckets } = useSubjects()

  return (
    <>
      <SubjectsBucket
        bucket={buckets.type}
        description='What type(s) of carbon removal does your submission cover?'
        value={value}
        onChange={onChange}
      />

      <SubjectsBucket
        bucket={buckets.focus}
        description='What aspect(s) of the system does it focus on?'
        value={value}
        onChange={onChange}
      />
      <SubjectsBucket
        bucket={buckets.method}
        description='What research method(s) were used?'
        value={value}
        onChange={onChange}
      />
    </>
  )
}

export default Subjects
