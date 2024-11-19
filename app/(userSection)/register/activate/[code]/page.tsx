import { db } from '@vercel/postgres'
import { redirect } from 'next/navigation'

import { activateAccount } from '../../../../../actions/account'
import ErrorState from './error-state'
import AgreementActivation from './agreement-activation'

type Props = { params: { code: string } }
const Page = async ({ params: { code } }: Props) => {
  const client = await db.connect()
  const { rows: confirmationCodes } =
    await client.sql`SELECT account_id FROM confirmation_codes WHERE confirmation_code = ${code}`

  const user = confirmationCodes.length === 1 && confirmationCodes[0].account_id

  if (user) {
    const { rows: userAgreements } =
      await client.sql`SELECT * FROM user_agreements WHERE account_id = ${user}`
    if (userAgreements.length === 1) {
      try {
        // If user has seen and accepted agreements, activate immediately and redirect.
        await activateAccount(user, code, { recordAgreement: false })
      } catch {
        return <ErrorState />
      }
    } else {
      // Otherwise, show + record agreement before activating.
      return <AgreementActivation user={user} code={code} />
    }
  } else {
    return (
      <ErrorState text='Activation code not found. If your account may have already been activated, try logging in instead.' />
    )
  }
  redirect('/account?activated=true')
}

export default Page
