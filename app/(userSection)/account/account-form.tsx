'use client'

import { User } from 'next-auth'
import { useEffect } from 'react'
import { Input } from 'theme-ui'

import { Button, Column, Field, Form, Row } from '../../../components'
import { useForm } from '../../../hooks/use-form'
import { updateAccount } from '../../../actions'
import { useLoading } from '../../../components/layouts/paneled-page'
import { isValidOrcid } from '../../../utils/data'

type FormData = {
  email: string
  first_name: string
  middle_name: string
  last_name: string
  orcid: string
  institution: string
}

type FormDataKey = keyof FormData

const initializeForm = (user: User | undefined): FormData => {
  return {
    email: user?.email ?? '',
    first_name: user?.first_name ?? '',
    middle_name: user?.middle_name ?? '',
    last_name: user?.last_name ?? '',
    orcid: user?.orcid ?? '',
    institution: user?.institution ?? '',
  }
}

const validateForm = ({
  email,
  first_name,
  middle_name,
  last_name,
  orcid,
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

  if (orcid && !isValidOrcid(orcid)) {
    result.orcid =
      'Please provide a valid ORCID identifier of the format 0000-0000-0000-0000.'
  }

  return result
}

const submitForm = async (
  user: User,
  updateUser: ({ user }: { user: User }) => void,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  formData: FormData,
) => {
  const initialParams: Partial<FormData> = {
    email: user.email ?? '',
  }
  const params = (Object.keys(formData) as FormDataKey[]).reduce(
    (accum, key) => {
      if (key !== 'email' && formData[key] !== user[key]) {
        ;(accum as Partial<Record<FormDataKey, string | null>>)[key] =
          formData[key] === '' &&
          ['middle_name', 'orcid', 'institution'].includes(key) // nullable fields
            ? null
            : formData[key]
      }

      return accum
    },
    initialParams,
  )

  setIsLoading(true)
  const { pk, ...updated } = await updateAccount(user, params)
  updateUser({ user: { id: pk, ...updated } })

  setIsLoading(false)
}

const AccountForm = ({
  user,
  updateUser,
}: {
  user: User
  updateUser: ({ user }: { user: User }) => void
}) => {
  const { setIsLoading } = useLoading()
  const { errors, submitError, data, blurs, setters, onSubmit } = useForm(
    initializeForm.bind(null, user),
    validateForm,
    submitForm.bind(null, user, updateUser, setIsLoading),
    { user: user.id ?? '' },
  )

  useEffect(() => {
    if (submitError) {
      setIsLoading(false)
    }
  }, [submitError, setIsLoading])

  return (
    <Form error={submitError}>
      {/* <Field
          label='Email*'
          id='email'
          error={errors.email}
          description='If you want to change your email address you may do so below, however, you will be logged out and your account will be marked as inactive until you follow the instructions in the verification email. Note: Changing your email address will also change your username as these are one and the same.'
        >
          <Flex sx={{ gap: 2 }}>
            <Input
              value={data.email}
              onBlur={blurs.email}
              onChange={(e) => setters.email(e.target.value)}
              id='email'
            />
            <Button sx={{ flexShrink: 0 }}>Update</Button>
          </Flex>
        </Field> */}
      <Row columns={[6, 6, 9, 9]} sx={{ mt: 3 }}>
        <Column start={1} width={[6, 2, 3, 3]}>
          <Field label='First name*' id='first_name' error={errors.first_name}>
            <Input
              value={data.first_name}
              onBlur={blurs.first_name}
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
              onBlur={blurs.middle_name}
              onChange={(e) => setters.middle_name(e.target.value)}
              id='middle_name'
            />
          </Field>
        </Column>
        <Column start={[1, 5, 7, 7]} width={[6, 2, 3, 3]}>
          <Field label='Last name*' id='last_name' error={errors.last_name}>
            <Input
              value={data.last_name}
              onBlur={blurs.last_name}
              onChange={(e) => setters.last_name(e.target.value)}
              id='last_name'
            />
          </Field>
        </Column>
      </Row>
      <Row columns={[6, 6, 8, 8]}>
        <Column start={1} width={[6, 3, 4, 4]}>
          <Field label='ORCID' id='orcid' error={errors.orcid}>
            <Input
              value={data.orcid}
              onBlur={blurs.orcid}
              onChange={(e) => setters.orcid(e.target.value)}
              id='orcid'
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
              onBlur={blurs.institution}
              onChange={(e) => setters.institution(e.target.value)}
              id='institution'
            />
          </Field>
        </Column>
      </Row>
      <Button onClick={onSubmit}>Update account</Button>
    </Form>
  )
}

export default AccountForm
