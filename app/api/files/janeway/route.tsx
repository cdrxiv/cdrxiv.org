import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import { fetchWithToken } from '../../utils'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()

    const res = await fetchWithToken(
      request.headers,
      `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/preprint_files/`,
      {
        method: 'POST',
        body: formData,
      },
    )

    if (!res.ok) {
      return NextResponse.json(
        { error: `Unable to create file. ${res.statusText}` },
        { status: res.status },
      )
    }

    const result = await res.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating preprint file:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
