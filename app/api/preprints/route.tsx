import type { NextRequest } from 'next/server'
import { fetchWithToken } from '../utils'
import { TEST_PREPRINTS } from '../placeholder-data'
import { Preprint } from '../../../types/preprint'

export async function GET(request: NextRequest) {
  let url =
    'https://carbonplan.endurance.janeway.systems/carbonplan/api/preprints/'

  const subject = request.nextUrl.searchParams.get('subject')
  if (subject) {
    const queryString = `subject=${subject}`
    url = `${url}?${queryString}`
  }

  const res = await fetchWithToken(request, url)

  let data
  if (res.status === 200) {
    // If authenticated, use actual result
    data = await res.json()
  } else {
    // Otherwise, use hardcoded response
    data = { ...TEST_PREPRINTS, test_data: true }
  }

  // TODO: remove when this is handled by the Janeway API
  // If subject query provided, manually filter data.results
  if (subject) {
    data.results = data.results.filter((el: Preprint) =>
      el.subject.find((s) => s.name === subject),
    )
  }

  return Response.json(data)
}
