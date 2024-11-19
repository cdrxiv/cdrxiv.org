import { PreprintFile, SupplementaryFile } from '../../types/preprint'
import { Deposition, DepositionFile } from '../../types/zenodo'
import { fetchWithTokenClient } from './fetch-with-token/client'
import { FileInputValue } from '../../components'

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
  setUploadProgress: SetUploadProgress,
) => {
  if (articleFile && !articleFile.persisted) {
    setUploadProgress((prev) => ({ ...prev, article: 0 }))
  }
  if (dataFile && !dataFile.persisted) {
    setUploadProgress((prev) => ({ ...prev, data: 0 }))
  }
}

export const handleArticleUpload = async (
  articleFile: FileInputValue | null,
  preprintId: number,
  setUploadProgress: SetUploadProgress,
  abortSignal?: AbortSignal,
) => {
  if (!articleFile?.file) return null

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
      abortSignal,
    },
  )
}

export const handleDataUpload = async (
  deposition: Deposition,
  dataFile: FileInputValue | null,
  setUploadProgress: (
    updater: (prev: UploadProgress) => UploadProgress,
  ) => void,
  abortSignal?: AbortSignal,
) => {
  if (!dataFile?.file) return null

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
      abortSignal,
    },
  )

  if (!depositionFile) {
    throw new Error('Failed to upload data file')
  }

  return [{ label: 'CDRXIV_DATA_DRAFT', url: deposition.links.self }]
}
