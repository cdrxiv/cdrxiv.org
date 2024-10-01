'use client'

import { useSession } from 'next-auth/react'
import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from 'theme-ui'
import HCaptcha from '@hcaptcha/react-hcaptcha'

import { Button, Column, Field, Form, Row } from '../../../components'
import { useForm } from '../../../hooks/use-form'
import { useLoading } from '../../../components/layouts/paneled-page'
import { verify } from '../../../actions/hcaptcha'

type FormData = {
  email: string
  first_name: string
  middle_name: string
  last_name: string
  orcid: string
  institution: string
  password: string
  repeat_password: string
  verified: boolean
}

const initializeForm = (): FormData => {
  return {
    email: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    orcid: '',
    institution: '',
    password: '',
    repeat_password: '',
    verified: false,
  }
}

const validateForm = ({
  email,
  first_name,
  middle_name,
  last_name,
  orcid,
  institution,
  password,
  repeat_password,
  verified,
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

  if (password.length < 12) {
    result.password = 'Your password must be at least 12 characters long.'
  }

  if (!password) {
    result.password = 'You must provide a password.'
  }

  if (password !== repeat_password) {
    result.repeat_password = 'Your passwords must match.'
  }

  if (!repeat_password) {
    result.repeat_password = 'You must confirm your password.'
  }

  if (!verified) {
    result.verified = 'You must complete the challenge.'
  }

  return result
}

const submitForm = async (
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  formData: FormData,
) => {
  setIsLoading(true)
  // TODO
  console.log('submitting')
  setIsLoading(false)
}

const Page = () => {
  const { status } = useSession()
  const router = useRouter()
  const { setIsLoading } = useLoading()
  const { errors, submitError, data, setters, onSubmit } = useForm(
    initializeForm,
    validateForm,
    submitForm.bind(null, setIsLoading),
    { user: 'new' },
  )

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/account')
    }
  }, [status, router])

  useEffect(() => {
    if (submitError) {
      setIsLoading(false)
    }
  }, [submitError, setIsLoading])

  const handleVerify = useCallback(
    async (token: string) => {
      const result = await verify(token)
      if (result) {
        setters.verified(true)
      }
    },
    [setters],
  )

  return (
    <Form error={submitError}>
      <Field label='Email*' id='email' error={errors.email}>
        <Input
          value={data.email}
          onChange={(e) => setters.email(e.target.value)}
          id='email'
        />
      </Field>
      <Row columns={[6, 6, 9, 9]}>
        <Column start={1} width={[6, 2, 3, 3]}>
          <Field label='First name*' id='first_name' error={errors.first_name}>
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
      <Row columns={[6, 6, 8, 8]}>
        <Column start={1} width={[6, 3, 4, 4]}>
          <Field label='ORCID' id='orcid' error={errors.orcid}>
            <Input
              value={data.orcid}
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
              onChange={(e) => setters.institution(e.target.value)}
              id='institution'
            />
          </Field>
        </Column>
      </Row>
      <Row columns={[6, 6, 8, 8]}>
        <Column start={1} width={[6, 3, 4, 4]}>
          <Field label='Password*' id='password' error={errors.password}>
            <Input
              value={data.password}
              type='password'
              onChange={(e) => setters.password(e.target.value)}
              id='password'
            />
          </Field>
        </Column>
        <Column start={[1, 4, 5, 5]} width={[6, 3, 4, 4]}>
          <Field
            label='Confirm password*'
            id='repeat_password'
            error={errors.repeat_password}
          >
            <Input
              value={data.repeat_password}
              type='password'
              onChange={(e) => setters.repeat_password(e.target.value)}
              id='repeat_password'
            />
          </Field>
        </Column>
      </Row>

      <Field error={errors.verified}>
        <HCaptcha
          sitekey='04a4d35c-a606-49c8-8832-b0440842c0aa'
          onVerify={handleVerify}
        />
      </Field>
      <Button onClick={onSubmit}>Create account</Button>
    </Form>
  )
}

export default Page
