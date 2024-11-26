'use client'

import { Label } from 'theme-ui'
import { useEffect, useState, useMemo } from 'react'

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
  const dataUrl = useMemo(
    () =>
      preprint?.supplementary_files?.find(
        (file: SupplementaryFile) => file.label === 'CDRXIV_DATA_DRAFT',
      )?.url,
    [preprint?.supplementary_files],
  )

  const [deposition, setDeposition] = useState<Deposition | null>(null)
  const [depositionLoading, setDepositionLoading] = useState<boolean>(
    dataUrl ? true : false,
  )

  const { data, setters, errors, onSubmit, submitError, setData } =
    useForm<FormData>(
      () => initializeForm(preprint, files, deposition),
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
    if (dataUrl) {
      fetchDataDeposition(dataUrl)
        .then((deposition) => {
          setDeposition(deposition)
          setData(
            (current) => ({
              ...current,
              dataFile:
                deposition.files.length === 1 // or maybe we always initialize to first entry so that users have something to "clear"
                  ? {
                      persisted: true,
                      mime_type: null,
                      original_filename: deposition.files[0].filename,
                      url: dataUrl,
                      file: null,
                    }
                  : null,
              persistedDeposition: deposition,
            }),
            true,
          )
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => setDepositionLoading(false))
    }
  }, [setData, dataUrl, setDepositionLoading])

  const [disableAgreement] = useState<boolean>(data.agreement)

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
          error={errors.articleFile ?? errors.persistedFiles}
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
          error={
            errors.dataFile ?? errors.externalFile ?? errors.persistedDeposition
          }
        >
          <DataFileInput
            file={data.dataFile}
            deposition={deposition}
            setFile={setters.dataFile}
            externalFile={data.externalFile}
            setExternalFile={setters.externalFile}
            loading={depositionLoading}
          />
        </Field>
      </Form>

      <NavButtons onClick={onSubmit} />
    </>
  )
}

export default SubmissionOverview
