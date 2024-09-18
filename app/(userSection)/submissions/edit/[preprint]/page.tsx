import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { fetchWithToken } from '../../../../api/utils'
import EditForm from './edit-form'
import { VersionQueue } from '../../../../../types/preprint'

const Page = async ({ params }: { params: { preprint: string } }) => {
  const [versionsRes, preprintRes] = await Promise.all([
    fetchWithToken(
      headers(),
      `https://carbonplan.endurance.janeway.systems/carbonplan/api/version_queue/?preprint=${params.preprint}`,
    ),
    fetchWithToken(
      headers(),
      `https://carbonplan.endurance.janeway.systems/carbonplan/api/user_preprints/${params.preprint}`,
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
