'use client'

import { Box, Flex, Label } from 'theme-ui'

import Checkbox from '../../../../components/checkbox'
import Field from '../../../../components/field'
import NavButtons from '../../nav-buttons'
import { usePreprint } from '../preprint-context'
import { useForm } from '../utils'
import { FormData, initializeForm, validateForm, submitForm } from './utils'

const SubmissionOverview = () => {
  const { preprint, setPreprint } = usePreprint()
  const { data, setters, errors, onSubmit, submitError } = useForm<FormData>(
    () => initializeForm(preprint),
    validateForm,
    submitForm.bind(null, preprint, setPreprint),
  )

  return (
    <>
      <Flex sx={{ flexDirection: 'column', gap: 7 }}>
        {submitError && <Box sx={{ color: 'red' }}>{submitError}</Box>}
        <Field
          label='Submission agreement'
          id='agreement'
          error={errors.agreement}
        >
          <Label>
            <Checkbox
              id='agreement'
              checked={data.agreement}
              onChange={(e) => setters.agreement(e.target.checked)}
            />
            Authors grant us the right to publish, on this website, their
            uploaded manuscript, supplementary materials and any supplied
            metadata.
          </Label>
        </Field>

        <Field
          label='Submission contents'
          id='contents'
          description='Select the content types you’d like to include in your submission.'
          error={errors.article ?? errors.data}
        >
          <Flex sx={{ gap: 8 }}>
            <Label sx={{ width: 'fit-content', alignItems: 'center' }}>
              <Checkbox
                value='article'
                checked={data.article}
                onChange={(e) => setters.article(e.target.checked)}
              />
              Article
            </Label>
            <Label sx={{ width: 'fit-content', alignItems: 'center' }}>
              <Checkbox
                value='data'
                checked={data.data}
                onChange={(e) => setters.data(e.target.checked)}
              />
              Data
            </Label>
          </Flex>
        </Field>
      </Flex>

      <NavButtons onClick={onSubmit} />
    </>
  )
}

export default SubmissionOverview
