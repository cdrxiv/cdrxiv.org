'use client'

import { Flex, Label } from 'theme-ui'
import { Checkbox, Link } from '../../../../components'
import { useSubjects } from '../../../subjects-context'

const Subjects: React.FC<{
  value: string[]
  onChange: (value: string[]) => void
}> = ({ value, onChange }) => {
  const subjects = useSubjects()

  const hasSelectedAll = value.length === subjects.length
  return (
    <Flex sx={{ flexDirection: 'column' }}>
      <Link
        onClick={() =>
          hasSelectedAll
            ? onChange([])
            : onChange(subjects.map(({ name }) => name))
        }
        sx={{ variant: 'text.mono', mb: 2 }}
      >
        {hasSelectedAll ? 'Select none' : 'Select all'}
      </Link>

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
