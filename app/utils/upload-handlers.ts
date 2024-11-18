import { PreprintFile, SupplementaryFile } from '../../types/preprint'
import { DepositionFile } from '../../types/zenodo'
import { fetchWithTokenClient } from './fetch-with-token/client'
import {
  deleteZenodoEntity,
  fetchDataDeposition,
  createDataDeposition,
} from '../../actions'
import { FileInputValue } from '../../components'

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

  throw new Error(
    'The file upload service is currently unavailable. Please try again in a few moments.',
  )
}

export type UploadProgress = {
  article?: number
  data?: number
}

type SetUploadProgress = (
  updater: (prev: UploadProgress) => UploadProgress,
) => void

export const initializeUploadProgress = (
  articleFile: FileInputValue | null,
  dataFile: FileInputValue | null,
  setUploadProgress: (
    updater: (prev: UploadProgress) => UploadProgress,
  ) => void,
) => {
  if (articleFile && !articleFile.persisted) {
    setUploadProgress((prev) => ({ ...prev, article: 1 }))
  }
  if (dataFile && !dataFile.persisted) {
    setUploadProgress((prev) => ({ ...prev, data: 1 }))
  }
}

export const handleArticleUpload = async (
  articleFile: FileInputValue | null,
  preprintId: number,
  setUploadProgress?: SetUploadProgress,
): Promise<PreprintFile | null> => {
  if (!articleFile || articleFile.persisted) return null

  const formData = new FormData()
  formData.set('file', articleFile.file)
  formData.set('preprint', String(preprintId))
  formData.set('mime_type', articleFile.mime_type)
  formData.set('original_filename', articleFile.original_filename)

  return fetchWithTokenClient<PreprintFile>(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/preprint_files/`,
    {
      method: 'POST',
      body: formData,
      onProgress: setUploadProgress
        ? (progress) =>
            setUploadProgress((prev) => ({ ...prev, article: progress }))
        : undefined,
      progressOptions: {
        baseProgress: 100,
        maxProgress: 100,
      },
      type: 'Article',
    },
  )
}

export const handleDataUpload = async (
  dataFile: FileInputValue | null,
  existingDataFile: SupplementaryFile | undefined,
  setUploadProgress?: SetUploadProgress,
): Promise<{ label: string; url: string }[] | null> => {
  if (!dataFile || dataFile.persisted) return null

  const deposition = await (existingDataFile
    ? fetchDataDeposition(existingDataFile.url)
    : createDataDeposition())

  if (deposition?.files?.length && deposition.files.length > 0) {
    await Promise.all(
      deposition.files.map((f) => deleteZenodoEntity(f.links.self)),
    )
  }

  // Wake up the server before attempting upload
  await wakeUpServer()

  const formData = new FormData()
  formData.set('name', dataFile.original_filename)
  formData.set('file', dataFile.file)

  const depositionFile = await fetchWithTokenClient<DepositionFile>(
    `${process.env.NEXT_PUBLIC_FILE_UPLOADER_URL}/zenodo/upload-file?deposition_id=${deposition.id}`,
    {
      method: 'POST',
      body: formData,
      onProgress: setUploadProgress
        ? (progress) =>
            setUploadProgress((prev) => ({ ...prev, data: progress }))
        : undefined,
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
