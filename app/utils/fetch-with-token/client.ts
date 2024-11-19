'use client'

import { getSession } from 'next-auth/react'
import { Session } from 'next-auth'

type ProgressCallback = (progress: number) => void

interface ProgressOptions {
  baseProgress?: number
  maxProgress?: number
}

export const fetchWithTokenClient = async <T>(
  url: string,
  options?: RequestInit & {
    onProgress?: ProgressCallback
    progressOptions?: ProgressOptions
    type?: 'Article' | 'Data'
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
              `${options?.type ? `${options.type} issue ; ` : ''}failed to parse response: ${error instanceof Error ? error.message : 'Unknown error'}`,
            ),
          )
        }
      } else {
        console.error(xhr.responseText)
        reject(
          new Error(
            `${options?.type ? `${options.type} error: ` : ''}${JSON.parse(xhr.responseText).file?.[0] || xhr.responseText}`,
          ),
        )
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

    if (options?.abortSignal) {
      options.abortSignal.addEventListener('abort', () => {
        xhr.abort()
        if (progressInterval) {
          clearInterval(progressInterval)
        }
        reject(new Error('Upload cancelled'))
      })
    }
  })
}
