'use client'

import { catchActionErrors } from './server-utils'

export function throwActionErrors<A extends any[], R>(
  serverAction: (...args: A) => Promise<R>,
): (...args: A) => Promise<R> {
  return async (...args: A) => {
    const result = await catchActionErrors(serverAction, ...args)
    if ('error' in result) {
      throw new Error(result.error)
    }

    return result.result
  }
}
