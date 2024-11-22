import { getSession } from 'next-auth/react'
import { Session } from 'next-auth'

import { PreprintFile } from '../types/preprint'
import { Deposition, DepositionFile } from '../types/zenodo'
import { FileInputValue } from '../components'
import { alertOnError } from '../actions/server-utils'

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
    type?: 'Article' | 'Data'
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
              `${options?.type ? `${options.type} issue ; ` : ''}failed to parse response: ${error instanceof Error ? error.message : 'Unknown error'}`,
            ),
          )
        }
      } else {
        console.error(xhr.responseText)
        alertOnError({
          endpoint: url,
          method: 'POST',
          status: xhr.status,
          statusText: xhr.statusText,
        }).then(() => {
          reject(
            new Error(
              `${options?.type ? `${options.type} error: ` : ''}${JSON.parse(xhr.responseText).file?.[0] || xhr.responseText}`,
            ),
          )
        })
      }
    })

    xhr.addEventListener('error', (error) => {
      console.error(error)
      if (progressInterval) {
        clearInterval(progressInterval)
      }
      reject(
        new Error(`${options?.type ? `${options.type} ` : ''}upload failed`),
      )
    })

    xhr.open('POST', url, true)

    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value as string)
    })

    xhr.send(options?.body as FormData)
  })
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
      type: 'Article',
    },
  )
}

export const handleDataUpload = async (
  deposition: Deposition,
  dataFile: FileInputValue | null,
  setUploadProgress?: SetUploadProgress,
): Promise<{ label: string; url: string }[] | null> => {
  if (!dataFile || dataFile.persisted) return null

  // Wake up the server before attempting upload
  await wakeUpServer()

  const formData = new FormData()
  formData.set('name', dataFile.original_filename)
  formData.set('file', dataFile.file)

  const depositionFile = await uploadFile<DepositionFile>(
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
