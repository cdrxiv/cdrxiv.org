import { notFound, redirect } from 'next/navigation'

import EditForm from './edit-form'
import { fetchWithToken } from '../../../../../actions/server-utils'

export const metadata = {
  title: 'Update Submission – CDRXIV',
}

const Page = async ({ params }: { params: { preprint: string } }) => {
  const [versionsRes, preprintRes] = await Promise.all([
    fetchWithToken(
      `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/version_queue/?preprint=${params.preprint}`,
    ),
    fetchWithToken(
      `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/user_preprints/${params.preprint}`,
    ),
  ])
  if (versionsRes.status !== 200 || preprintRes.status !== 200) {
    if (preprintRes.status === 404) {
      notFound()
    }

    redirect(
      `/account?signOut=true&callbackUrl=/submissions/edit/${params.preprint}`,
    )
  }
  const [versions, preprint] = await Promise.all([
    versionsRes.json(),
    preprintRes.json(),
  ])

  return <EditForm versions={versions.results} preprint={preprint} />
}

export default Page
