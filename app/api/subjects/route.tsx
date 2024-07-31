import type { NextRequest } from 'next/server'
import { fetchWithToken } from '../utils'
import { TEST_SUBJECTS } from '../placeholder-data'
import { getTopics } from '../utils'

export async function GET(request: NextRequest) {
  return getTopics(request)
}
