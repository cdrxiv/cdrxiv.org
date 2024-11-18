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
} from '../../../../actions/'
import { FileInputValue } from '../../../../components'
import { LICENSE_MAPPING } from '../../constants'
import {
  handleArticleUpload,
  handleDataUpload,
  initializeUploadProgress,
} from '../../../utils/upload-handlers'

export type FormData = {
  agreement: boolean
  articleFile: FileInputValue | null
  dataFile: FileInputValue | null
  externalFile: SupplementaryFile | null
}
export const initializeForm = (
  preprint: Preprint,
  files: PreprintFile[],
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
  }
}

export const validateForm = ({
  agreement,
  articleFile,
  dataFile,
  externalFile,
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
}

const cleanupFiles = async (
  existingDataFile: SupplementaryFile | undefined,
  submissionType: string,
  files: PreprintFile[],
  articleFile: FormData['articleFile'],
) => {
  const cleanupTasks: Promise<any>[] = []
  if (existingDataFile && submissionType === 'Article') {
    cleanupTasks.push(deleteZenodoEntity(existingDataFile.url))
  }
  if (files.length > 0 && submissionType === 'Data') {
    cleanupTasks.push(...files.map((file) => deletePreprintFile(file.pk)))
  }
  // clear other article files if needed
  if (files.length > 0 && articleFile && !articleFile?.persisted) {
    files.forEach((file) => cleanupTasks.push(deletePreprintFile(file.pk)))
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
}: SubmissionContext) => {
  if (!preprint) {
    throw new Error('Tried to submit without active preprint')
  }

  initializeUploadProgress(articleFile, dataFile, setUploadProgress)

  const existingDataFile = preprint.supplementary_files.find(
    (file) => file.label === 'CDRXIV_DATA_DRAFT',
  )
  const submissionType = getSubmissionType({ dataFile, articleFile })

  await cleanupFiles(existingDataFile, submissionType, files, articleFile)

  const [newPreprintFile, supplementaryFiles] = await Promise.all([
    handleArticleUpload(articleFile, preprint.pk, setUploadProgress),
    handleDataUpload(dataFile, existingDataFile, setUploadProgress),
  ])

  // Prepare final supplementary files
  const finalSupplementaryFiles = dataFile?.persisted
    ? preprint.supplementary_files
    : (supplementaryFiles ?? (externalFile ? [externalFile] : []))

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
