import type { NextRequest } from 'next/server'
import { fetchWithToken } from '../utils'

export async function GET(request: NextRequest) {
  return fetchWithToken(
    request,
    'https://carbonplan.endurance.janeway.systems/carbonplan/api/repository_subjects/',
  )
}
