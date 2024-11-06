'use server'

export async function wrapServerAction<A extends any[], R>(
  serverAction: (...args: A) => Promise<R>,
  ...args: A
) {
  let result
  try {
    result = await serverAction(...args)
    return result
  } catch (e: any) {
    return {
      error: e.message ?? 'Error saving changes.',
    }
  }
}
