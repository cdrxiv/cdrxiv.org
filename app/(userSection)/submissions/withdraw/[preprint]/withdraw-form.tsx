'use client'

import { Box, Flex, Label } from 'theme-ui'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import {
  ReviewPreprint,
  PublishedPreprint,
  Preprint,
} from '../../../../../types/preprint'
import SharedLayout from '../../../shared-layout'
import { Button, Checkbox, Field, Form, Link } from '../../../../../components'
import { formatDate } from '../../../../../utils/formatters'
import { useForm } from '../../../../../hooks/use-form'
import {
  createAdditionalField,
  getAdditionalField,
} from '../../../../../utils/data'
import { createVersionQueue } from '../../../../../actions'
import { useLoading } from '../../../../../components/layouts/paneled-page'
import { updatePreprint } from '../../../../../actions/preprint'

type Props = {
  preprint: ReviewPreprint | PublishedPreprint
}
type FormData = {
  title: string
  abstract: string
  withdrawal: string

  // The only editable field
  confirmed: boolean
}
const initializeForm = (preprint: Props['preprint']): FormData => {
  return {
    title: `WITHDRAWN: ${preprint.title}`,
    abstract: `WITHDRAWN: ${preprint.abstract}`,
    withdrawal: getAdditionalField(preprint, 'Withdrawal status') ?? '',
    confirmed: false,
  }
}
const validateForm = ({ confirmed, withdrawal }: FormData) => {
  let result: Partial<{ [K in keyof FormData]: string }> = {}
  if (withdrawal === 'Requested') {
    result.withdrawal =
      'A request to withdraw has already been initiated and will be reviewed by CDRXIV staff.'
  }
  if (withdrawal === 'Approved') {
    result.withdrawal = 'This submission has already been withdrawn.'
  }
  if (!confirmed) {
    result.confirmed = 'Please confirm.'
  }
  return result
}
const submitForm = async (
  preprint: Preprint,
  { title, abstract }: FormData,
) => {
  await updatePreprint(preprint, {
    additional_field_answers: [
      ...preprint.additional_field_answers,
      createAdditionalField('Withdrawal status', 'Requested'),
    ],
  })
  return createVersionQueue({
    preprint: preprint.pk,
    update_type: 'version',
    title,
    abstract,
  })
}

const WithdrawFormContent: React.FC<Props> = ({ preprint }) => {
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState<boolean>(false)
  const { setIsLoading } = useLoading()
  const { data, setters, errors, onSubmit, submitError } = useForm(
    () => initializeForm(preprint),
    validateForm,
    (values: FormData) => submitForm(preprint, values),
    { preprint: preprint.pk },
  )

  const handleSubmit = useCallback(async () => {
    setIsLoading(true)
    const result = await onSubmit()
    if (result) {
      setShowSuccess(true)
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [onSubmit, router, setIsLoading])

  return (
    <Form error={submitError ?? errors.withdrawal}>
      {showSuccess ? (
        <>
          <Box sx={{ variant: 'text.monoCaps' }}>
            Your withdrawal request was successfully submitted.
          </Box>

          <Link href='/' forwardArrow>
            Home
          </Link>
        </>
      ) : (
        <>
          <Box
            sx={{
              variant: 'text.mono',
              width: '100%',
              height: 'auto',
              p: [3, 6, 6, 7],
              borderColor: 'text',
              borderWidth: '1px',
              borderStyle: 'solid',
              outline: 'none',
            }}
          >
            <Flex sx={{ flexDirection: 'column', gap: 3 }}>
              <Box sx={{ variant: 'text.body' }}>{preprint.title}</Box>
              <Box>{preprint.abstract}</Box>
            </Flex>
          </Box>

          <Field label='Confirmation*' id='confirmed' error={errors.confirmed}>
            <Label>
              <Checkbox
                id='confirmed'
                checked={data.confirmed}
                onChange={(e) => setters.confirmed(e.target.checked)}
              />
              By submitting, you confirm your request to withdraw the above
              submission from CDRXIV. If your submission is withdrawn, it will
              still be shown on CDRXIV with prominent notices about its
              withdrawal.
            </Label>
          </Field>

          <Button onClick={handleSubmit}>Submit</Button>
        </>
      )}
    </Form>
  )
}

// Wrapper so that loading context is available
const WithdrawForm: React.FC<Props> = ({ preprint }) => {
  return (
    <SharedLayout
      title={'Request Withdrawal'}
      metadata={
        preprint.date_published && (
          <Field label='Live version'>
            <Box as='ul' sx={{ variant: 'styles.ul' }}>
              <Box as='li' sx={{ variant: 'styles.li' }}>
                <Link
                  href={`/preprint/${preprint.pk}`}
                  sx={{ variant: 'text.mono' }}
                >
                  {formatDate(new Date(preprint.date_published))}
                </Link>
              </Box>
            </Box>
          </Field>
        )
      }
    >
      <WithdrawFormContent preprint={preprint} />
    </SharedLayout>
  )
}
export default WithdrawForm
