'use client'

import { useSession } from 'next-auth/react'
import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Input } from 'theme-ui'
import HCaptcha from '@hcaptcha/react-hcaptcha'

import {
  Button,
  Column,
  Field,
  Form,
  Link,
  PasswordInput,
  Row,
} from '../../../components'
import { useForm } from '../../../hooks/use-form'
import { useLoading } from '../../../components/layouts/paneled-page'
import { registerAccount, verifyHCaptcha } from '../../../actions'

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
  {
    email,
    first_name,
    middle_name,
    last_name,
    orcid,
    institution,
    password,
  }: FormData,
) => {
  setIsLoading(true)
  await registerAccount({
    email,
    first_name,
    middle_name: middle_name || null,
    last_name,
    orcid: orcid || null,
    institution: institution || null,
    password,
  })
  setIsLoading(false)
}

const Page = () => {
  const { status } = useSession()
  const router = useRouter()
  const { setIsLoading } = useLoading()
  const { errors, submitError, data, setters, blurs, onSubmit } = useForm(
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
      const result = await verifyHCaptcha(token)
      if (result) {
        setters.verified(true)
      }
    },
    [setters],
  )

  const handleSubmit = useCallback(async () => {
    const result = await onSubmit()
    if (result) {
      router.push('/register/success')
    }
  }, [onSubmit, router])

  return (
    <Form
      error={
        submitError ? (
          <>
            {submitError}
            {submitError.includes('already exists') ? (
              <>
                {' '}
                Create a new account below or reset your password{' '}
                <Link
                  href='https://janeway.cdrxiv.org/reset/step/1/'
                  sx={{ color: 'red' }}
                >
                  here
                </Link>
                .
              </>
            ) : null}
          </>
        ) : null
      }
    >
      <Field label='Email*' id='email' error={errors.email}>
        <Input
          value={data.email}
          onChange={(e) => setters.email(e.target.value)}
          onBlur={blurs.email}
          id='email'
        />
      </Field>
      <Row columns={[6, 6, 9, 9]}>
        <Column start={1} width={[6, 2, 3, 3]}>
          <Field label='First name*' id='first_name' error={errors.first_name}>
            <Input
              value={data.first_name}
              onChange={(e) => setters.first_name(e.target.value)}
              onBlur={blurs.first_name}
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
              onBlur={blurs.middle_name}
              id='middle_name'
            />
          </Field>
        </Column>
        <Column start={[1, 5, 7, 7]} width={[6, 2, 3, 3]}>
          <Field label='Last name*' id='last_name' error={errors.last_name}>
            <Input
              value={data.last_name}
              onChange={(e) => setters.last_name(e.target.value)}
              onBlur={blurs.last_name}
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
              onBlur={blurs.orcid}
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
              onBlur={blurs.institution}
              id='institution'
            />
          </Field>
        </Column>
      </Row>
      <Row columns={[6, 6, 8, 8]}>
        <Column start={1} width={[6, 3, 4, 4]}>
          <Field label='Password*' id='password' error={errors.password}>
            <PasswordInput
              value={data.password}
              onChange={(e) => setters.password(e.target.value)}
              onBlur={blurs.password}
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
            <PasswordInput
              value={data.repeat_password}
              onChange={(e) => setters.repeat_password(e.target.value)}
              onBlur={blurs.repeat_password}
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

      <Box>
        By registering an account, you agree to our{' '}
        <Link href='/TK'>Terms of Use</Link> and acknowledge our{' '}
        <Link href='/TK'>Privacy Policy</Link> and{' '}
        <Link href='/TK'>Cookies Disclosure</Link>.
      </Box>
      <Button onClick={handleSubmit}>Create account</Button>
    </Form>
  )
}

export default Page
