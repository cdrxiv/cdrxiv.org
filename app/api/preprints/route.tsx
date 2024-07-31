import type { NextRequest } from 'next/server'
import { getPreprints } from '../utils'

export async function GET(request: NextRequest) {
  return getPreprints(request)
}
