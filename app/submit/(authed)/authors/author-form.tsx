'use client'

import { Box, Flex, Input } from 'theme-ui'

import Field from '../../../../components/field'
import { usePreprint } from '../preprint-context'
import { useForm } from '../utils'
import { Preprint } from '../../../../types/preprint'
import { createAuthor, updatePreprint } from '../actions'
import Row from '../../../../components/row'
import Column from '../../../../components/column'
import StyledButton from '../../../../components/button'

type FormData = {
  email: string
  first_name: string
  middle_name: string
  last_name: string
  institution: string
}
const initializeForm = () => {
  return {
    email: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    institution: '',
  }
}

const validateForm = ({
  email,
  first_name,
  middle_name,
  last_name,
  institution,
}: FormData) => {
  let result: Partial<{ [K in keyof FormData]: string }> = {}

  if (!email) {
    result.email = 'You must provide an email.'
  }
  if (!first_name) {
    result.first_name = 'You must provide a first name.'
  }
  if (!last_name) {
    result.last_name = 'You must provide a last name.'
  }

  return result
}

const submitForm = async (
  preprint: Preprint,
  setPreprint: (p: Preprint) => void,
  { email, first_name, middle_name, last_name, institution }: FormData,
) => {
  const author = await createAuthor({
    email,
    first_name,
    middle_name,
    last_name,
    // institution,
  })

  return updatePreprint(preprint, {
    authors: [...preprint?.authors, author],
  }).then((updated) => setPreprint(updated))
}

const AuthorForm = () => {
  const { preprint, setPreprint } = usePreprint()
  const { data, setters, errors, onSubmit, submitError } = useForm<FormData>(
    initializeForm,
    validateForm,
    submitForm.bind(null, preprint, setPreprint),
  )

  return (
    <>
      <Flex sx={{ flexDirection: 'column', gap: 7 }}>
        {submitError && <Box sx={{ color: 'red' }}>{submitError}</Box>}
        <Box>
          <Row columns={[6, 6, 9, 9]} sx={{ mt: 3 }}>
            <Column start={1} width={[6, 2, 3, 3]}>
              <Field
                label='First name*'
                id='first_name'
                error={errors.first_name}
              >
                <Input
                  value={data.first_name}
                  onChange={(e) => setters.first_name(e.target.value)}
                  id='first_name'
                />
              </Field>
            </Column>
            <Column start={[1, 3, 4, 4]} width={[6, 2, 3, 3]}>
              <Field
                label='Middle name'
                id='middle_name'
                error={errors.middle_name}
              >
                <Input
                  value={data.middle_name}
                  onChange={(e) => setters.middle_name(e.target.value)}
                  id='middle_name'
                />
              </Field>
            </Column>
            <Column start={[1, 5, 7, 7]} width={[6, 2, 3, 3]}>
              <Field label='Last name*' id='last_name' error={errors.last_name}>
                <Input
                  value={data.last_name}
                  onChange={(e) => setters.last_name(e.target.value)}
                  id='last_name'
                />
              </Field>
            </Column>
          </Row>
          <Row columns={[6, 6, 8, 8]} sx={{ mt: [0, 3, 3, 3] }}>
            <Column start={1} width={[6, 3, 4, 4]}>
              <Field label='Email*' id='email' error={errors.email}>
                <Input
                  value={data.email}
                  onChange={(e) => setters.email(e.target.value)}
                  id='email'
                />
              </Field>
            </Column>
            <Column start={[1, 4, 5, 5]} width={[6, 3, 4, 4]}>
              <Field
                label='Affiliation'
                id='institution'
                error={errors.institution}
              >
                <Input
                  value={data.institution}
                  onChange={(e) => setters.institution(e.target.value)}
                  id='institution'
                />
              </Field>
            </Column>
          </Row>
        </Box>
      </Flex>
      <StyledButton onClick={onSubmit} sx={{ width: 'fit-content' }}>
        Add author
      </StyledButton>
    </>
  )
}

export default AuthorForm
