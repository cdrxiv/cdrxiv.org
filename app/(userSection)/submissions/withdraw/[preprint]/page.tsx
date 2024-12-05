import { notFound, redirect } from 'next/navigation'

import WithdrawForm from './withdraw-form'
import { fetchWithToken } from '../../../../../actions/server-utils'

export const metadata = {
  title: 'Withdraw Submission – CDRXIV',
}

const Page = async ({ params }: { params: { preprint: string } }) => {
  const preprintRes = await fetchWithToken(
    `${process.env.NEXT_PUBLIC_JANEWAY_URL}/api/user_preprints/${params.preprint}`,
  )

  if (preprintRes.status !== 200) {
    if (preprintRes.status === 404) {
      notFound()
    }
    redirect(
      `/account?signOut=true&callbackUrl=/submissions/withdraw/${params.preprint}`,
    )
  }
  const preprint = await preprintRes.json()

  return <WithdrawForm preprint={preprint} />
}

export default Page
