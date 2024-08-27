import {
  Preprint,
  PreprintFile,
  SupplementaryFile,
} from '../../../../types/preprint'
import { createAdditionalField } from '../utils'
import {
  deleteZenodoEntity,
  deletePreprintFile,
  updatePreprint,
} from '../actions'

export type FormData = {
  agreement: boolean
  articleFile: PreprintFile | 'loading' | null
  dataFile: SupplementaryFile | 'loading' | null
  externalFile: SupplementaryFile | null
}
export const initializeForm = (
  preprint: Preprint,
  files: PreprintFile[],
): FormData => {
  return {
    agreement: false,
    articleFile: files.reduce(
      (last: PreprintFile | null, file: PreprintFile) =>
        !last || last.pk < file.pk ? file : last,
      null,
    ),
    dataFile:
      preprint.supplementary_files.find(
        (file) => file.label === 'CDRXIV_DATA_DRAFT',
      ) ?? null,
    externalFile:
      preprint.supplementary_files.find(
        (file) =>
          file.label !== 'CDRXIV_DATA_DRAFT' && file.label !== 'CDRXIV_DATA',
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

  if (articleFile === 'loading') {
    result.articleFile =
      'Please finish uploading your file or clear your in-progress upload.'
  }

  if (dataFile === 'loading') {
    result.dataFile =
      'Please finish uploading your file or clear your in-progress upload.'
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
  const hasDataFile = dataFile && dataFile !== 'loading'
  const hasArticleFile = articleFile && articleFile !== 'loading'
  if (hasDataFile && hasArticleFile) {
    submissionType = 'Both'
  } else if (hasDataFile) {
    submissionType = 'Data'
  } else {
    submissionType = 'Article'
  }

  return submissionType
}

export const submitForm = (
  preprint: Preprint,
  setPreprint: (p: Preprint) => void,
  files: PreprintFile[],
  { articleFile, dataFile, externalFile }: FormData,
) => {
  if (!preprint) {
    throw new Error('Tried to submit without active preprint')
  }

  if (articleFile === 'loading' || dataFile === 'loading') {
    throw new Error('Tried to submit while file upload is in progress.')
  }

  const submissionType = getSubmissionType({ dataFile, articleFile })
  let supplementaryFiles
  if (dataFile) {
    supplementaryFiles = [dataFile]
  } else {
    supplementaryFiles = externalFile ? [externalFile] : []
  }

  const params = {
    additional_field_answers: [
      ...preprint.additional_field_answers,
      createAdditionalField('Submission type', submissionType),
    ],
    supplementary_files: supplementaryFiles,
  }

  let cleanUpFiles: () => Promise<any> = async () => null

  // If the data file has been cleared...
  const existingDataFile = preprint.supplementary_files.find(
    (file) => file.label === 'CDRXIV_DATA_DRAFT',
  )
  if (existingDataFile && submissionType === 'Article') {
    cleanUpFiles = () => deleteZenodoEntity(existingDataFile.url)
  }

  // If the article PDF file has been cleared...
  if (files.length > 0 && submissionType === 'Data') {
    cleanUpFiles = () =>
      Promise.all(files.map((file) => deletePreprintFile(file.pk)))
  }

  return updatePreprint(preprint, params)
    .then((updated) => setPreprint(updated))
    .then(cleanUpFiles)
}
