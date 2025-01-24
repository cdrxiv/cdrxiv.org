import {
  Preprint,
  PreprintFile,
  SupplementaryFile,
} from '../../../../types/preprint'

import { createAdditionalField } from '../../../../utils/data'
import {
  deletePreprintFile,
  updatePreprint,
  deleteZenodoEntity,
  createDataDeposition,
} from '../../../../actions'
import { FileInputValue } from '../../../../components'
import { LICENSE_MAPPING } from '../../constants'
import {
  handleArticleUpload,
  handleDataUpload,
  initializeUploadProgress,
} from '../../../../utils/file-uploads'
import { Deposition } from '../../../../types/zenodo'
import { UPLOAD_CANCELLED_MESSAGE } from '../../../../utils/file-uploads'

export type FormData = {
  agreement: boolean
  articleFile: FileInputValue | null
  dataFile: FileInputValue | null
  externalFile: SupplementaryFile | null
  persistedDeposition: Deposition | null
  persistedFiles: PreprintFile[]
}
export const initializeForm = (
  preprint: Preprint,
  persistedFiles: PreprintFile[],
  persistedDeposition: Deposition | null,
): FormData => {
  const articleFile = persistedFiles.reduce(
    (last: PreprintFile | null, file: PreprintFile) =>
      !last || last.pk < file.pk ? file : last,
    null,
  )
  const dataFile =
    preprint.supplementary_files.find(
      (file) => file.label === 'CDRXIV_DATA_DRAFT',
    ) ?? null
  return {
    agreement: !!(articleFile || dataFile),
    articleFile: articleFile
      ? {
          persisted: true,
          mime_type: null,
          original_filename: articleFile.original_filename,
          url: articleFile.public_download_url,
          file: null,
        }
      : null,
    dataFile:
      persistedDeposition?.files[0] && persistedDeposition.links.self
        ? {
            persisted: true,
            mime_type: null,
            original_filename: persistedDeposition.files[0].filename,
            url: persistedDeposition.links.self,
            file: null,
          }
        : null,
    externalFile:
      preprint.supplementary_files.find(
        (file) =>
          file.label !== 'CDRXIV_DATA_DRAFT' &&
          file.label !== 'CDRXIV_DATA_PUBLISHED',
      ) ?? null,
    persistedDeposition,
    persistedFiles,
  }
}

export const validateForm = ({
  agreement,
  articleFile,
  dataFile,
  externalFile,
  persistedDeposition,
  persistedFiles,
}: FormData) => {
  let result: Partial<{ [K in keyof FormData]: string }> = {}

  if (!agreement) {
    result.agreement = 'You must accept the user agreement to continue.'
  }

  if (!articleFile && !dataFile) {
    result.articleFile = 'You must upload at least one content type.'
    if (!externalFile) {
      result.dataFile = 'You must upload at least one content type.'
    }
  }

  if (externalFile) {
    if (!externalFile.label || !externalFile.url) {
      result.externalFile =
        'Please provide a label and URL for your file, or upload your data to CDRXIV directly.'
    } else {
      if (externalFile.label.includes('CDRXIV_DATA')) {
        result.externalFile =
          'This label is reserved. Please enter a different label.'
      }

      try {
        const url = new URL(externalFile.url)
        const parts = url.hostname.split('.')
        if (parts.length < 2) {
          result.externalFile =
            'Please provide a URL with a valid top-level domain.'
        }
      } catch {
        result.externalFile =
          'Please enter a valid URL, including the protocol (e.g., https://) and a domain name with a valid extension (e.g., .com, .org).'
      }
    }
  }

  if (
    persistedDeposition &&
    persistedDeposition.files.length !== 1 &&
    dataFile?.persisted
  ) {
    result.persistedDeposition =
      'There is an issue with your data upload. Please clear the file and try again.'
  }

  if (persistedFiles.length > 1 && articleFile?.persisted) {
    result.persistedFiles =
      'There is an issue with your article upload. Please clear the file and try again.'
  }

  return result
}

export const getSubmissionType = ({
  dataFile,
  articleFile,
}: {
  dataFile: FormData['dataFile']
  articleFile: FormData['articleFile']
}): string => {
  let submissionType
  if (dataFile && articleFile) {
    submissionType = 'Both'
  } else if (dataFile) {
    submissionType = 'Data'
  } else {
    submissionType = 'Article'
  }

  return submissionType
}

type UploadProgress = {
  article?: number
  data?: number
}

type SubmissionContext = {
  preprint: Preprint
  setPreprint: (p: Preprint) => void
  files: PreprintFile[]
  setFiles: (files: PreprintFile[]) => void
  formData: FormData
  setUploadProgress: (updater: (prev: UploadProgress) => UploadProgress) => void
  abortSignal?: AbortSignal
}

const getUpdatedFields = (
  preprint: Preprint,
  submissionType: string,
  dataFile: FormData['dataFile'],
  dataResult: PromiseSettledResult<Deposition | null> | null,
  externalFile: SupplementaryFile | null,
) => {
  const finalSupplementaryFiles = dataFile?.persisted
    ? preprint.supplementary_files
    : dataResult?.status === 'fulfilled' && dataResult.value
      ? [{ label: 'CDRXIV_DATA_DRAFT', url: dataResult.value.links.self }]
      : externalFile
        ? [externalFile]
        : []

  const additionalFieldAnswers = [
    ...preprint.additional_field_answers.filter(
      (field) =>
        field.field?.name !== 'Submission type' &&
        !(
          // Remove 'Data license' when there is no data included
          (submissionType === 'Article' && field.field?.name === 'Data license')
        ) &&
        !(
          // Remove 'Data license' for data-only submissions when it is out-of-sync with main license
          (
            submissionType === 'Data' &&
            field.field?.name === 'Data license' &&
            LICENSE_MAPPING[field.answer as 'cc-by-4.0' | 'cc-by-nc-4.0'] !==
              preprint.license?.pk
          )
        ),
    ),
    createAdditionalField('Submission type', submissionType),
  ]

  return {
    additional_field_answers: additionalFieldAnswers,
    supplementary_files: finalSupplementaryFiles,
  }
}

const cleanupFiles = async (
  existingDataFile: SupplementaryFile | undefined,
  submissionType: string,
  files: PreprintFile[],
  uploadResults: [PreprintFile | null, Deposition | null],
  dataUploadFailed?: boolean,
) => {
  const [newPreprintFile, newDeposition] = uploadResults
  const cleanupTasks: Promise<any>[] = []

  // basic cleanup of old files when switching between article and data
  if (existingDataFile && submissionType === 'Article') {
    cleanupTasks.push(deleteZenodoEntity(existingDataFile.url))
  }
  if (files.length > 0 && submissionType === 'Data') {
    cleanupTasks.push(...files.map((file) => deletePreprintFile(file.pk)))
  }

  // Clean up old article files if we have a new one
  if (newPreprintFile) {
    cleanupTasks.push(
      ...files
        .filter((file) => file.pk !== newPreprintFile.pk)
        .map((file) => deletePreprintFile(file.pk)),
    )
  }

  // Clean up failed new deposition
  if (dataUploadFailed && newDeposition) {
    cleanupTasks.push(deleteZenodoEntity(newDeposition.links.self))
  }

  // Clean up old data deposition on successful upload
  if (!dataUploadFailed && newDeposition && existingDataFile) {
    cleanupTasks.push(deleteZenodoEntity(existingDataFile.url))
  }

  await Promise.all(cleanupTasks)
}

export const submitForm = async ({
  preprint,
  setPreprint,
  files,
  setFiles,
  formData: { articleFile, dataFile, externalFile },
  setUploadProgress,
  abortSignal,
}: SubmissionContext) => {
  if (!preprint) {
    throw new Error('Tried to submit without active preprint')
  }

  const existingDataFile = preprint.supplementary_files.find(
    (file) => file.label === 'CDRXIV_DATA_DRAFT',
  )
  const submissionType = getSubmissionType({ dataFile, articleFile })

  initializeUploadProgress(articleFile, dataFile, setUploadProgress)

  let newDeposition: Deposition | null = null
  if (submissionType !== 'Article' && dataFile && !dataFile.persisted) {
    newDeposition = await createDataDeposition()
  }

  const [articleResult, dataResult] = await Promise.allSettled([
    handleArticleUpload(
      articleFile,
      preprint.pk,
      setUploadProgress,
      abortSignal,
    ),
    newDeposition
      ? handleDataUpload(
          newDeposition,
          dataFile,
          setUploadProgress,
          abortSignal,
        )
      : Promise.resolve(null),
  ])

  try {
    // If failures, keep submission type in sync with remaining file
    if (
      articleResult.status === 'rejected' ||
      dataResult.status === 'rejected'
    ) {
      const bothFailed =
        articleResult.status === 'rejected' && dataResult.status === 'rejected'
      let remainingType = bothFailed ? 'Article' : 'Data'
      if (
        articleResult.status === 'rejected' &&
        dataResult.status === 'fulfilled'
      ) {
        remainingType = 'Data'
      }

      const updates = getUpdatedFields(
        preprint,
        remainingType,
        dataFile,
        dataResult,
        externalFile,
      )

      await updatePreprint(preprint, updates)
        .then(setPreprint)
        .catch(console.error)

      // Display errors
      const cancelledUploads = [articleResult, dataResult].filter(
        (r) =>
          r.status === 'rejected' &&
          r.reason?.message === UPLOAD_CANCELLED_MESSAGE,
      )
      if (cancelledUploads.length > 0) {
        throw new Error('Upload cancelled')
      } else {
        const failedUploads = [
          { type: 'Article', result: articleResult },
          { type: 'Data', result: dataResult },
        ].filter(({ result }) => result.status === 'rejected') as {
          type: string
          result: PromiseRejectedResult
        }[]

        const errorMessage = failedUploads
          .map(
            ({ result, type }) =>
              `${type} upload failed: ${result.reason?.message || 'Unknown error'}`,
          )
          .join('; ')
        console.error('failed uploads: ', failedUploads)
        throw new Error(errorMessage)
      }
    }

    const updates = getUpdatedFields(
      preprint,
      submissionType,
      dataFile,
      dataResult,
      externalFile,
    )

    const updatedPreprint = await updatePreprint(preprint, updates)
    setPreprint(updatedPreprint)
    if (articleResult.status === 'fulfilled' && articleResult.value) {
      setFiles([articleResult.value])
    }
  } finally {
    await cleanupFiles(
      existingDataFile,
      submissionType,
      files,
      [
        articleResult.status === 'fulfilled' ? articleResult.value : null,
        newDeposition,
      ],
      dataResult && dataResult.status !== 'fulfilled',
    ).catch(console.error)
  }
}
