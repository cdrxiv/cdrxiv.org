import { getSession } from 'next-auth/react'
import { Session } from 'next-auth'
import { Deposition } from '../types/zenodo'
import { PreprintFile } from '../types/preprint'
import { FileInputValue } from '../components/file-input'
import { alertOnError } from '../actions/server-utils'

export const UPLOAD_CANCELLED_MESSAGE = 'Upload cancelled'

type ProgressCallback = (progress: number) => void

interface ProgressOptions {
  baseProgress?: number
  maxProgress?: number
}

export const uploadFile = async <T>(
  url: string,
  options?: RequestInit & {
    onProgress?: ProgressCallback
    progressOptions?: ProgressOptions
    abortSignal?: AbortSignal
  },
): Promise<T> => {
  const session = (await getSession()) as Session | null

  if (!session?.accessToken) {
    throw new Error('Not authenticated')
  }

  const headers = {
    ...options?.headers,
    Authorization: `Bearer ${session.accessToken}`,
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const startTime = Date.now()
    let progressInterval: ReturnType<typeof window.setInterval> | null = null

    const baseProgress = options?.progressOptions?.baseProgress ?? 100
    const maxProgress = options?.progressOptions?.maxProgress ?? 100

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && options?.onProgress) {
        // Scale from 0 to baseProgress during upload
        const uploadProgressPercent = event.loaded / event.total
        const scaledProgress = uploadProgressPercent * baseProgress
        options.onProgress(scaledProgress)
      }
    })

    // When upload completes, start simulating progress from baseProgress to maxProgress
    xhr.upload.addEventListener('loadend', () => {
      const uploadDuration = Date.now() - startTime

      if (options?.onProgress) {
        let currentProgress = baseProgress
        const remainingRange = maxProgress - baseProgress

        progressInterval = setInterval(() => {
          currentProgress += remainingRange / 20

          if (currentProgress >= maxProgress) {
            if (progressInterval) clearInterval(progressInterval)
            options?.onProgress?.(maxProgress)
          } else {
            options?.onProgress?.(currentProgress)
          }
        }, uploadDuration / 10) // Scale interval based on how long the upload took
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (progressInterval) {
          clearInterval(progressInterval)
        }
        if (options?.onProgress) {
          options.onProgress(100)
        }
        try {
          const response = JSON.parse(xhr.responseText)
          resolve(response as T)
        } catch (error) {
          reject(
            new Error(
              `Failed to parse response: ${error instanceof Error ? error.message : 'Unknown error'}`,
            ),
          )
        }
      } else {
        console.error('Upload failed:', xhr.responseText)

        let errorMessage: string
        try {
          const errorResponse = JSON.parse(xhr.responseText)
          errorMessage =
            errorResponse.detail || // looks like both janeway and our api return this
            'Unknown error occurred'
        } catch (e) {
          errorMessage = xhr.responseText || 'Unknown error occurred'
        }

        alertOnError({
          endpoint: url,
          method: 'POST',
          status: xhr.status,
          statusText: xhr.statusText,
          apiError: errorMessage,
        }).then(() => {
          reject(new Error(errorMessage))
        })
      }
    })

    xhr.addEventListener('error', (event) => {
      console.error('XHR error:', event)
      if (progressInterval) {
        clearInterval(progressInterval)
      }
      const errorMessage = 'Network error occurred while uploading file'
      alertOnError({
        endpoint: url,
        method: 'POST',
        status: 0,
        statusText: errorMessage,
      }).then(() => {
        reject(new Error(errorMessage))
      })
    })

    xhr.open('POST', url, true)

    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value as string)
    })

    xhr.send(options?.body as FormData)

    if (options?.abortSignal) {
      options.abortSignal.addEventListener('abort', () => {
        xhr.abort()
        if (progressInterval) {
          clearInterval(progressInterval)
        }
        reject(new Error(UPLOAD_CANCELLED_MESSAGE))
      })
    }
  })
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

  return uploadFile<PreprintFile>(
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

  const depositionFile = await uploadFile<Deposition>(
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
      abortSignal,
    },
  )

  if (!depositionFile) {
    throw new Error('Failed to upload data file')
  }

  return depositionFile
}
