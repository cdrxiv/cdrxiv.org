import {
  Preprint,
  PreprintFile,
  SupplementaryFile,
} from '../../../../types/preprint'
import { createAdditionalField } from '../utils'
import {
  deletePreprintFile,
  updatePreprint,
  createPreprintFile,
} from '../../../../actions/preprint'
import {
  deleteZenodoEntity,
  fetchDataDeposition,
  createDataDeposition,
  createDataDepositionFile,
} from '../../../../actions/zenodo'
import { FileInputValue } from '../../../../components'
import { LICENSE_MAPPING } from '../../constants'

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
    agreement: false,
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

export const submitForm = async (
  preprint: Preprint,
  setPreprint: (p: Preprint) => void,
  files: PreprintFile[],
  setFiles: (files: PreprintFile[]) => void,
  { articleFile, dataFile, externalFile }: FormData,
) => {
  if (!preprint) {
    throw new Error('Tried to submit without active preprint')
  }

  const existingDataFile = preprint.supplementary_files.find(
    (file) => file.label === 'CDRXIV_DATA_DRAFT',
  )
  const submissionType = getSubmissionType({ dataFile, articleFile })

  let preprintFiles: PreprintFile[]
  // Save article PDF if it hasn't already been persisted
  if (articleFile && !articleFile.persisted) {
    const formData = new FormData()

    formData.set('file', articleFile.file)
    formData.set('preprint', String(preprint?.pk))
    formData.set('mime_type', articleFile.mime_type)
    formData.set('original_filename', articleFile.original_filename)

    const preprintFile = await createPreprintFile(formData)
    preprintFiles = [preprintFile]
  }

  let cleanUpFiles: () => Promise<any> = async () => null

  // If the data file has been cleared...
  if (existingDataFile && submissionType === 'Article') {
    cleanUpFiles = () => deleteZenodoEntity(existingDataFile.url) // delete the data deposition
  }

  // If the article PDF file has been cleared...
  if (files.length > 0 && submissionType === 'Data') {
    preprintFiles = []
    cleanUpFiles = () =>
      Promise.all(files.map((file) => deletePreprintFile(file.pk))) // delete previous preprint files
  }

  let supplementaryFiles
  if (dataFile?.persisted) {
    supplementaryFiles = preprint.supplementary_files
  } else if (dataFile) {
    // Save data file if it hasn't already been persisted
    const formData = new FormData()
    formData.set('name', dataFile.original_filename)
    formData.set('file', dataFile.file)

    const deposition = await (existingDataFile
      ? fetchDataDeposition(existingDataFile.url)
      : createDataDeposition())
    if (deposition.files.length > 0) {
      await Promise.all([
        deposition.files.map((f) => deleteZenodoEntity(f.links.self)), // delete previous data deposition files
      ])
    }
    await createDataDepositionFile(deposition.id, formData)

    supplementaryFiles = [
      { label: 'CDRXIV_DATA_DRAFT', url: deposition.links.self },
    ]
  } else {
    supplementaryFiles = externalFile ? [externalFile] : []
  }

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
    supplementary_files: supplementaryFiles,
  }

  return updatePreprint(preprint, params)
    .then((updated) => setPreprint(updated))
    .then(cleanUpFiles)
    .then(() => (preprintFiles ? setFiles(preprintFiles) : undefined))
}
