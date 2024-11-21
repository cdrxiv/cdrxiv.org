import {
  Preprint,
  PreprintFile,
  SupplementaryFile,
} from '../../../../types/preprint'

import { createAdditionalField } from '../utils'
import {
  deletePreprintFile,
  updatePreprint,
  deleteZenodoEntity,
  fetchDataDeposition,
  createDataDeposition,
} from '../../../../actions'
import { FileInputValue } from '../../../../components'
import { LICENSE_MAPPING } from '../../constants'
import {
  handleArticleUpload,
  handleDataUpload,
  initializeUploadProgress,
} from '../../../utils/upload-handlers'
import { Deposition } from '../../../../types/zenodo'

export type FormData = {
  agreement: boolean
  articleFile: FileInputValue | null
  dataFile: FileInputValue | null
  externalFile: SupplementaryFile | null
  deposition: Deposition | null
  files: PreprintFile[]
}
export const initializeForm = (
  preprint: Preprint,
  files: PreprintFile[],
  deposition: Deposition | null,
): FormData => {
  const articleFile = files.reduce(
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
    dataFile: dataFile
      ? {
          persisted: true,
          mime_type: null,
          original_filename: dataFile.url,
          url: dataFile.url,
          file: null,
        }
      : null,
    externalFile:
      preprint.supplementary_files.find(
        (file) =>
          file.label !== 'CDRXIV_DATA_DRAFT' &&
          file.label !== 'CDRXIV_DATA_PUBLISHED',
      ) ?? null,
    deposition,
    files,
  }
}

export const validateForm = ({
  agreement,
  articleFile,
  dataFile,
  externalFile,
  deposition,
  files,
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
    deposition &&
    deposition.files.length > 1 &&
    (!dataFile || dataFile.persisted)
  ) {
    result.deposition =
      'There is an issue with you data upload, please clear the file and try again.'
  }

  if (files.length > 1) {
    result.files =
      'There is an issue with you article upload, please clear the file and try again.'
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

const cleanupFiles = async (
  existingDataFile: SupplementaryFile | undefined,
  submissionType: string,
  files: PreprintFile[],
  oldDeposition: Deposition | null,
  uploadResults: [PreprintFile | null, Deposition | null],
) => {
  const [newPreprintFile, newDeposition] = uploadResults
  const cleanupTasks: Promise<any>[] = []

  console.log({
    existingDataFile,
    submissionType,
    files,
    oldDeposition,
    newDeposition,
  })

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

  // Clean up old Zenodo files if we have new files
  if (newDeposition && oldDeposition?.files) {
    cleanupTasks.push(
      ...oldDeposition.files.map((file) => deleteZenodoEntity(file.links.self)),
    )
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

  initializeUploadProgress(articleFile, dataFile, setUploadProgress)

  const existingDataFile = preprint.supplementary_files.find(
    (file) => file.label === 'CDRXIV_DATA_DRAFT',
  )
  const submissionType = getSubmissionType({ dataFile, articleFile })

  let deposition: Deposition | null = null
  if (submissionType !== 'Article') {
    if (existingDataFile) {
      deposition = await fetchDataDeposition(existingDataFile.url)
    } else {
      deposition = await createDataDeposition()
    }
  }

  const results = await Promise.allSettled([
    handleArticleUpload(
      articleFile,
      preprint.pk,
      setUploadProgress,
      abortSignal,
    ),
    deposition
      ? handleDataUpload(deposition, dataFile, setUploadProgress, abortSignal)
      : Promise.resolve(null),
  ])

  const failures: Array<{ type: string; error: Error; cancelled: boolean }> = []
  const successes: (PreprintFile | Deposition | null)[] = []

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      const uploadType = index === 0 ? 'Article' : 'Data'
      failures.push({
        type: uploadType,
        error: result.reason,
        cancelled: result.reason?.message === 'Upload cancelled',
      })
    } else {
      successes[index] = result.value as PreprintFile | Deposition | null
    }
  })

  // Clean up files based on what succeeded
  await cleanupFiles(
    existingDataFile,
    submissionType,
    files,
    deposition,
    successes as [PreprintFile | null, Deposition | null],
  )

  // After cleanup, handle any failures
  if (failures.length > 0) {
    const remainingType =
      failures.length === 2
        ? 'Article' // Both failed - default to Article
        : failures[0].type === 'Article'
          ? 'Data'
          : 'Article'

    const hasOtherFile =
      failures.length === 1 &&
      (failures[0].type === 'Article' ? !!dataFile : !!articleFile)

    const additionalFieldAnswers = [
      ...preprint.additional_field_answers.filter(
        (field) => field.field?.name !== 'Submission type',
      ),
      createAdditionalField(
        'Submission type',
        hasOtherFile ? remainingType : 'Article', // Default to article
      ),
    ]

    updatePreprint(preprint, {
      additional_field_answers: additionalFieldAnswers,
    })
      .then(setPreprint)
      .catch(console.error)

    // Handle error display
    const cancelledUploads = failures.filter((f) => f.cancelled)
    if (cancelledUploads.length === 2) {
      throw new Error('All uploads cancelled')
    } else if (cancelledUploads.length === 1) {
      throw new Error(`${cancelledUploads[0].type} upload cancelled`)
    } else {
      const errorMessage = failures
        .map(
          (f) =>
            `${f.type} upload failed: ${f.error?.message || 'Unknown error'}`,
        )
        .join('; ')
      throw new Error(errorMessage)
    }
  }

  const [newPreprintFile, newDeposition] = successes as [
    PreprintFile | null,
    Deposition | null,
  ]

  // Prepare final supplementary files
  const finalSupplementaryFiles = dataFile?.persisted
    ? preprint.supplementary_files
    : newDeposition?.links.self
      ? [{ label: 'CDRXIV_DATA_DRAFT', url: newDeposition.links.self }]
      : externalFile
        ? [externalFile]
        : []

  const additionalFieldAnswers = [
    ...preprint.additional_field_answers.filter(
      (field) =>
        field.field?.name !== 'Submission type' &&
        !(
          // Remove 'Data license' there is no data included
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

  const params = {
    additional_field_answers: additionalFieldAnswers,
    supplementary_files: finalSupplementaryFiles,
  }

  return updatePreprint(preprint, params)
    .then((updated) => setPreprint(updated))
    .then(() => (newPreprintFile ? setFiles([newPreprintFile]) : undefined))
}
