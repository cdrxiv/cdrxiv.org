import {
  Preprint,
  PreprintFile,
  SupplementaryFile,
} from '../../../../types/preprint'
import { createAdditionalField } from '../utils'
import {
  deleteDataDeposition,
  deletePreprintFile,
  updatePreprint,
} from '../actions'

export type FormData = {
  agreement: boolean
  articleFile: PreprintFile | null
  dataFile: SupplementaryFile | null
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
  }
}

export const validateForm = ({
  agreement,
  articleFile,
  dataFile,
}: FormData) => {
  let result: Partial<{ [K in keyof FormData]: string }> = {}

  if (!agreement) {
    result.agreement = 'You must accept the user agreement to continue.'
  }

  if (!articleFile && !dataFile) {
    result.articleFile = 'You must include at least one content type.'
    result.dataFile = 'You must include at least one content type.'
  }

  return result
}

export const submitForm = (
  preprint: Preprint,
  setPreprint: (p: Preprint) => void,
  files: PreprintFile[],
  { articleFile, dataFile }: FormData,
) => {
  if (!preprint) {
    throw new Error('Tried to submit without active preprint')
  }

  let submissionType
  if (dataFile && articleFile) {
    submissionType = 'Both'
  } else if (dataFile) {
    submissionType = 'Data'
  } else {
    submissionType = 'Article'
  }
  const params = {
    additional_field_answers: [
      createAdditionalField('Submission type', submissionType),
    ],
    supplementary_files: preprint.supplementary_files, // default to no changes
  }

  let cleanUpFiles: () => Promise<any> = async () => null

  // If the data file has been cleared...
  const existingDataFile = preprint.supplementary_files.find(
    (file) => file.label === 'CDRXIV_DATA_DRAFT',
  )
  if (existingDataFile && submissionType === 'Article') {
    params.supplementary_files = preprint.supplementary_files.filter(
      (file) => file.label !== 'CDRXIV_DATA_DRAFT',
    )
    cleanUpFiles = () => deleteDataDeposition(existingDataFile.url)
  }

  // If the article PDF file has been cleared...
  if (
    preprint.supplementary_files.find(
      (file) => file.label === 'CDRXIV_DATA_DRAFT',
    ) &&
    submissionType === 'Data'
  ) {
    cleanUpFiles = () =>
      Promise.all(files.map((file) => deletePreprintFile(file.pk)))
  }

  return updatePreprint(preprint, params)
    .then((updated) => setPreprint(updated))
    .then(cleanUpFiles)
}
