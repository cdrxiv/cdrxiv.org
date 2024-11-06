'use server'

export async function wrapServerAction<A, R>(
  args: A,
  serverAction: (args: A) => Promise<R>,
) {
  let result
  try {
    result = await serverAction(args)
    return result
  } catch (e: any) {
    return {
      error: e.message ?? 'Error saving changes.',
    }
  }
}
