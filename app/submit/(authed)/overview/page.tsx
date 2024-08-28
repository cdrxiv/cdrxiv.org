'use client'

import { Label } from 'theme-ui'

import { Checkbox, Field, Form } from '../../../../components'
import NavButtons from '../../nav-buttons'
import { usePreprint, usePreprintFiles } from '../preprint-context'
import { useForm } from '../utils'
import { FormData, initializeForm, validateForm, submitForm } from './utils'
import DataFileInput from './data-file-input'
import FileInput from './file-input'

const SubmissionOverview = () => {
  const { preprint, setPreprint } = usePreprint()
  const { files } = usePreprintFiles()
  const { data, setters, errors, onSubmit, submitError } = useForm<FormData>(
    () => initializeForm(preprint, files),
    validateForm,
    submitForm.bind(null, preprint, setPreprint, files),
  )

  return (
    <>
      <Form error={submitError}>
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
          description='Your submission can by represented by a single file of any format, including ZIP, up to [TK] MB.'
          error={errors.dataFile ?? errors.externalFile}
        >
          <DataFileInput
            file={data.dataFile}
            setFile={setters.dataFile}
            externalFile={data.externalFile}
            setExternalFile={setters.externalFile}
          />
        </Field>
      </Form>

      <NavButtons onClick={onSubmit} />
    </>
  )
}

export default SubmissionOverview
