import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { fetchWithToken } from '../../../../utils/fetch-with-token/server'
import EditForm from './edit-form'

export const metadata = {
  title: 'Update Submission – CDRXIV',
}

const Page = async ({ params }: { params: { preprint: string } }) => {
  const [versionsRes, preprintRes] = await Promise.all([
    fetchWithToken(
      headers(),
      `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/version_queue/?preprint=${params.preprint}`,
    ),
    fetchWithToken(
      headers(),
      `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/user_preprints/${params.preprint}`,
    ),
  ])
  if (versionsRes.status !== 200 || preprintRes.status !== 200) {
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
