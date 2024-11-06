'use server'

export async function wrapServerAction<R>(serverAction: () => Promise<R>) {
  let result
  try {
    result = await serverAction()
    return result
  } catch (e: any) {
    return {
      error: e.message ?? 'Error saving changes.',
    }
  }
}
