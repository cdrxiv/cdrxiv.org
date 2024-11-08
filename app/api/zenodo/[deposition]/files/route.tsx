import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { deposition: string } },
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()

    const res = await fetch(
      process.env.NEXT_PUBLIC_ZENODO_URL +
        `/api/deposit/depositions/${params.deposition}/files`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.ZENODO_ACCESS_TOKEN}`,
        },
        body: formData,
      },
    )

    if (!res.ok) {
      return NextResponse.json(
        { error: `Unable to upload data file. ${res.statusText}` },
        { status: res.status },
      )
    }

    const result = await res.json()

    if (!result.id) {
      return NextResponse.json(
        { error: result.message ?? 'Unable to create deposition file.' },
        { status: 400 },
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
