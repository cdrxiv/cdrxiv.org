import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { authOptions } from '../../../lib/auth'
import { fetchWithToken } from '../../utils/fetch-with-token/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 },
    )
  }
  try {
    const session = await getServerSession(authOptions)
    const response = await (session
      ? fetchWithToken(headers(), url)
      : fetch(url))
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const pdfResponse = new NextResponse(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
      },
    })
    return pdfResponse
  } catch (error) {
    console.error('Error fetching PDF:', error)
    return NextResponse.json({ error: 'Failed to fetch PDF' }, { status: 500 })
  }
}
