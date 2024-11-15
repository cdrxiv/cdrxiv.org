'use client'

import { Label } from 'theme-ui'
import { useCallback, useState } from 'react'

import { Checkbox, Field, FileInput, Form } from '../../../../components'
import NavButtons from '../../nav-buttons'
import { usePreprint, usePreprintFiles } from '../../preprint-context'
import { useForm } from '../utils'
import { FormData, initializeForm, validateForm, submitForm } from './utils'
import DataFileInput from './data-file-input'
import { updatePreprint } from '../../../../actions'
import { useLoading } from '../../../../components/layouts/paneled-page'

const SubmissionOverview = () => {
  const { preprint, setPreprint } = usePreprint()
  const { files, setFiles } = usePreprintFiles()
  const { setUploadProgress } = useLoading()

  const { data, setters, errors, onSubmit, submitError } = useForm<FormData>(
    () => initializeForm(preprint, files),
    validateForm,
    (values: FormData) =>
      submitForm({
        preprint,
        setPreprint,
        files,
        setFiles,
        formData: values,
        setUploadProgress,
      }),
  )
  const [disableAgreement] = useState<boolean>(data.agreement)

  const handleDataFileError = useCallback(() => {
    return updatePreprint(preprint, { supplementary_files: [] }).then(
      (updated) => setPreprint(updated),
    )
  }, [preprint, setPreprint])

  return (
    <>
      <Form error={submitError}>
        <Field
          label='Submission agreement*'
          id='agreement'
          error={errors.agreement}
        >
          <Label>
            <Checkbox
              id='agreement'
              checked={data.agreement}
              onChange={(e) => setters.agreement(e.target.checked)}
              disabled={disableAgreement}
            />
            Authors grant us the right to publish, on this website, their
            uploaded Manuscript, Supplementary Materials and any supplied
            metadata.
          </Label>
        </Field>

        <Field
          label='Article file'
          id='articleFile'
          description='Your article must be submitted as a PDF.'
          error={errors.articleFile}
        >
          <FileInput
            file={data.articleFile}
            onChange={setters.articleFile}
            accept='application/pdf'
          />
        </Field>

        <Field
          label='Data file'
          id='dataFile'
          description='Your data submission must be a single file of any format, including ZIP.'
          error={errors.dataFile ?? errors.externalFile}
        >
          <DataFileInput
            file={data.dataFile}
            setFile={setters.dataFile}
            externalFile={data.externalFile}
            setExternalFile={setters.externalFile}
            onError={handleDataFileError}
          />
        </Field>
      </Form>

      <NavButtons onClick={onSubmit} />
    </>
  )
}

export default SubmissionOverview
