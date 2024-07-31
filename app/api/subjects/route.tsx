import type { NextRequest } from 'next/server'
import { getSubjects } from '../utils'

export async function GET(request: NextRequest) {
  return getSubjects(request)
}
