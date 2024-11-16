import {
  Preprint,
  PreprintFile,
  SupplementaryFile,
} from '../../../../types/preprint'
import { DepositionFile } from '../../../../types/zenodo'

import { createAdditionalField } from '../utils'
import {
  deletePreprintFile,
  updatePreprint,
  deleteZenodoEntity,
  fetchDataDeposition,
  createDataDeposition,
} from '../../../../actions/'
import { FileInputValue } from '../../../../components'
import { LICENSE_MAPPING } from '../../constants'
import { fetchWithTokenClient } from '../../../utils/fetch-with-token/client'
import { revalidateTag } from 'next/cache'

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

const initializeUploadProgress = (
  articleFile: FormData['articleFile'],
  dataFile: FormData['dataFile'],
  setUploadProgress: SubmissionContext['setUploadProgress'],
) => {
  if (articleFile && !articleFile.persisted) {
    setUploadProgress((prev) => ({ ...prev, article: 1 }))
  }
  if (dataFile && !dataFile.persisted) {
    setUploadProgress((prev) => ({ ...prev, data: 1 }))
  }
}

const handleArticleUpload = async (
  articleFile: FormData['articleFile'],
  preprint: Preprint,
  setUploadProgress: SubmissionContext['setUploadProgress'],
): Promise<PreprintFile | null> => {
  if (!articleFile || articleFile.persisted) return null

  const formData = new FormData()
  formData.set('file', articleFile.file)
  formData.set('preprint', String(preprint?.pk))
  formData.set('mime_type', articleFile.mime_type)
  formData.set('original_filename', articleFile.original_filename)

  return fetchWithTokenClient<PreprintFile>(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/preprint_files/`,
    {
      method: 'POST',
      body: formData,
      onProgress: (progress) =>
        setUploadProgress((prev) => ({ ...prev, article: progress })),
      progressOptions: {
        baseProgress: 100,
        maxProgress: 100,
      },
      type: 'Article',
    },
  )
}

const wakeUpServer = async () => {
  const healthUrl = `${process.env.NEXT_PUBLIC_FILE_UPLOADER_URL}/health`
  const maxAttempts = 3
  const delayMs = 500

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(healthUrl)
      if (response.ok) return
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    } catch (error) {
      if (attempt === maxAttempts - 1) {
        throw new Error(
          'Unable to connect to the file upload service. Please try again in a few moments.',
        )
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }

  // If we've exhausted all attempts without success
  throw new Error(
    'The file upload service is currently unavailable. Please try again in a few moments.',
  )
}

const handleDataUpload = async (
  dataFile: FormData['dataFile'],
  existingDataFile: SupplementaryFile | undefined,
  setUploadProgress: SubmissionContext['setUploadProgress'],
): Promise<{ label: string; url: string }[] | null> => {
  if (!dataFile || dataFile.persisted) return null

  // Save data file if it hasn't already been persisted
  const formData = new FormData()
  formData.set('name', dataFile.original_filename)
  formData.set('file', dataFile.file)

  const deposition = await (existingDataFile
    ? fetchDataDeposition(existingDataFile.url)
    : createDataDeposition())

  if (deposition.files.length > 0) {
    await Promise.all(
      deposition.files.map((f) => deleteZenodoEntity(f.links.self)),
    )
  }

  // Wake up the server before attempting upload
  await wakeUpServer()

  const depositionFile = await fetchWithTokenClient<DepositionFile>(
    `${process.env.NEXT_PUBLIC_FILE_UPLOADER_URL}/zenodo/upload-file?deposition_id=${deposition.id}`,
    {
      method: 'POST',
      body: formData,
      onProgress: (progress) =>
        setUploadProgress((prev) => ({ ...prev, data: progress })),
      progressOptions: {
        baseProgress: 50,
        maxProgress: 95,
      },
      type: 'Data',
    },
  )

  if (!depositionFile) {
    throw new Error('Failed to upload data file')
  }

  return [{ label: 'CDRXIV_DATA_DRAFT', url: deposition.links.self }]
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
    handleArticleUpload(articleFile, preprint, setUploadProgress),
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
