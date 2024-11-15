'use client'

import { Box, Flex } from 'theme-ui'
import { useCallback, useState } from 'react'

import Agreement from '../../agreement'
import { Button, Field, Form, Link } from '../../../../../components'
import { activateAccount } from '../../../../../actions/account'

const AgreementActivation = ({
  user,
  code,
}: {
  user: number
  code: string
}) => {
  const [activateError, setActivateError] = useState<string>()
  const [agreementError, setAgreementError] = useState<string>()
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const [successful, setSuccessful] = useState<boolean>(false)
  const handleClick = useCallback(async () => {
    if (!isChecked) {
      setAgreementError(
        'You must agree and acknowledge in order to activate your account.',
      )
      return
    }

    setActivateError(undefined) // clear form error
    setAgreementError(undefined) // clear field error
    try {
      await activateAccount(user, code, { recordAgreement: true })
      setSuccessful(true)
    } catch (e: any) {
      setActivateError(e.message ?? 'Error activating account.')
    }
  }, [user, code, isChecked])

  return (
    <Form error={activateError}>
      {successful ? (
        <>
          <Box>Activation successful!</Box>

          <Flex sx={{ flexDirection: 'column', gap: 2 }}>
            <Box>
              To finish setting up your account, set your account credentials on
              Janeway, which CDRXIV uses for authentication:
            </Box>

            <Link href='https://janeway.cdrxiv.org/reset/step/1/'>
              https://janeway.cdrxiv.org/reset/step/1/
            </Link>
          </Flex>
        </>
      ) : (
        <>
          <Field error={agreementError}>
            <Agreement
              action='activating'
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
          </Field>

          <Button onClick={handleClick}>Activate account</Button>
        </>
      )}
    </Form>
  )
}

export default AgreementActivation
