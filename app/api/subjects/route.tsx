import type { NextRequest } from 'next/server'
import { fetchWithToken } from '../utils'
import { TEST_SUBJECTS } from '../placeholder-data'

export async function GET(request: NextRequest) {
  const result = await fetchWithToken(
    request,
    'https://carbonplan.endurance.janeway.systems/carbonplan/api/repository_subjects/',
  )
  if (result.status === 200) {
    // If authenticated, return actual result
    return result
  } else {
    // Otherwise, return hardcoded response
    return Response.json({ ...TEST_SUBJECTS, test_data: true })
  }
}
