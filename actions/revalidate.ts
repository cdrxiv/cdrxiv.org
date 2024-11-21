'use server'

import { revalidateTag } from 'next/cache'

export async function revalidateTagFromClient(tag: string) {
  revalidateTag(tag)
}
