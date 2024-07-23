import type { NextRequest } from 'next/server'
import { fetchWithToken } from '../utils'

const HARDCODED_RESPONSE = {
  count: 11,
  next: null,
  previous: null,
  results: [
    {
      name: 'Alkaline waste mineralization',
      preprint_set: [],
    },
    {
      name: 'Biochar',
      preprint_set: [],
    },
    {
      name: 'Biomass carbon removal and storage',
      preprint_set: [],
    },
    {
      name: 'Direct air capture',
      preprint_set: [],
    },
    {
      name: 'Direct ocean removal',
      preprint_set: [],
    },
    {
      name: 'Enhanced rock weathering',
      preprint_set: [],
    },
    {
      name: 'Ocean alkalinity enhancement (electrochemical)',
      preprint_set: [],
    },
    {
      name: 'Ocean alkalinity enhancement (mineral)',
      preprint_set: [],
    },
    {
      name: 'Ocean biomass sinking (harvest)',
      preprint_set: [],
    },
    {
      name: 'Ocean biomass sinking (no harvest)',
      preprint_set: [],
    },
    {
      name: 'Terrestrial biomass sinking',
      preprint_set: [],
    },
  ],
}

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
    return Response.json({ ...HARDCODED_RESPONSE, test_data: true })
  }
}
