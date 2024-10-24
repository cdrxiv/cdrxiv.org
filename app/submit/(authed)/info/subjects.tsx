'use client'

import { Flex, Label } from 'theme-ui'
import { Checkbox } from '../../../../components'
import { useSubjects } from '../../../subjects-context'

const Subjects: React.FC<{
  value: string[]
  onChange: (value: string[]) => void
}> = ({ value, onChange }) => {
  const subjects = useSubjects()

  return (
    <Flex sx={{ flexDirection: 'column' }} role='group'>
      {subjects.map(({ name }) => (
        <Label
          key={name}
          sx={{
            cursor: 'pointer',
          }}
        >
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
  )
}

export default Subjects
