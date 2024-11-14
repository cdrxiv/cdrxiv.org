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
    let uploadComplete = false
    let progressInterval: NodeJS.Timeout | null = null

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
      uploadComplete = true
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
          reject(new Error('Failed to parse response'))
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`))
      }
    })

    xhr.addEventListener('error', () => {
      if (progressInterval) {
        clearInterval(progressInterval)
      }
      reject(new Error('Upload failed'))
    })

    xhr.open('POST', url, true)

    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value as string)
    })

    xhr.send(options?.body as FormData)
  })
}
