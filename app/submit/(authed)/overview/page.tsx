'use client'

import { Label } from 'theme-ui'
import { useCallback, useEffect, useState } from 'react'

import { Checkbox, Field, FileInput, Form } from '../../../../components'
import NavButtons from '../../nav-buttons'
import { usePreprint, usePreprintFiles } from '../../preprint-context'
import { useForm } from '../utils'
import { FormData, initializeForm, validateForm, submitForm } from './utils'
import DataFileInput from './data-file-input'
import { fetchDataDeposition, updatePreprint } from '../../../../actions'
import { useLoading } from '../../../../components/layouts/paneled-page'
import { Deposition } from '../../../../types/zenodo'
import { SupplementaryFile } from '../../../../types/preprint'

const SubmissionOverview = () => {
  const { preprint, setPreprint } = usePreprint()
  const { files, setFiles } = usePreprintFiles()
  const { setUploadProgress, setAbortController } = useLoading()
  const [deposition, setDeposition] = useState<Deposition | null>(null)

  useEffect(() => {
    const dataUrl = preprint.supplementary_files.find(
      (file: SupplementaryFile) => file.label === 'CDRXIV_DATA_DRAFT',
    )?.url

    if (dataUrl) {
      fetchDataDeposition(dataUrl).then(setDeposition)
    }
  }, [preprint.supplementary_files])

  const { data, setters, errors, onSubmit, submitError, setData } =
    useForm<FormData>(
      () => initializeForm(preprint, files, null),
      validateForm,
      async (values: FormData) => {
        const controller = setAbortController
          ? new AbortController()
          : undefined
        if (controller && setAbortController) {
          setAbortController(controller)
        }

        try {
          await submitForm({
            preprint,
            setPreprint,
            files,
            setFiles,
            formData: values,
            setUploadProgress,
            abortSignal: controller?.signal,
          })
        } finally {
          if (controller && setAbortController) {
            setAbortController(undefined)
          }
        }
      },
    )

  useEffect(() => {
    if (deposition) {
      setData((current) => ({
        ...current,
        deposition,
      }))
    }
  }, [deposition, setData])

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
          error={errors.articleFile ?? errors.files}
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
          description='Your data submission must be a single file of any format, including ZIP, up to 10 GB.'
          error={errors.dataFile ?? errors.externalFile ?? errors.deposition}
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
